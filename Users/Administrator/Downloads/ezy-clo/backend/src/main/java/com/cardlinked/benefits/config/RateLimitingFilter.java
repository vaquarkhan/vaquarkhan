package com.cardlinked.benefits.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, Object> redisTemplate;
    
    // Rate limiting configuration
    private static final int DEFAULT_REQUESTS_PER_MINUTE = 60;
    private static final int LOGIN_REQUESTS_PER_MINUTE = 5;
    private static final int API_REQUESTS_PER_MINUTE = 1000;

    @Autowired
    public RateLimitingFilter(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIpAddress(request);
        String requestPath = request.getRequestURI();
        
        // Determine rate limit based on endpoint
        int requestsPerMinute = determineRateLimit(requestPath);
        
        // Create rate limit key
        String rateLimitKey = "rate_limit:" + clientIp + ":" + requestPath;
        
        // Check current request count
        String currentCountStr = (String) redisTemplate.opsForValue().get(rateLimitKey);
        int currentCount = currentCountStr != null ? Integer.parseInt(currentCountStr) : 0;
        
        if (currentCount >= requestsPerMinute) {
            // Rate limit exceeded
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Please try again later.\"}");
            return;
        }
        
        // Increment counter
        redisTemplate.opsForValue().increment(rateLimitKey);
        
        // Set expiration if this is the first request
        if (currentCount == 0) {
            redisTemplate.expire(rateLimitKey, Duration.ofMinutes(1));
        }
        
        // Add rate limit headers
        response.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerMinute));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, requestsPerMinute - currentCount - 1)));
        response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + 60000));
        
        filterChain.doFilter(request, response);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private int determineRateLimit(String requestPath) {
        if (requestPath.contains("/auth/login") || requestPath.contains("/auth/sso")) {
            return LOGIN_REQUESTS_PER_MINUTE;
        } else if (requestPath.startsWith("/api/")) {
            return API_REQUESTS_PER_MINUTE;
        } else {
            return DEFAULT_REQUESTS_PER_MINUTE;
        }
    }
}