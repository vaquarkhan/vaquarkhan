package com.cardlinked.benefits.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.regex.Pattern;

@Component
public class InputValidationFilter extends OncePerRequestFilter {

    // Patterns for detecting malicious input
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        "(?i)(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror)",
        Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern XSS_PATTERN = Pattern.compile(
        "(?i)(<script|</script|javascript:|vbscript:|onload=|onerror=|onclick=|onmouseover=)",
        Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern PATH_TRAVERSAL_PATTERN = Pattern.compile(
        "(\\.\\.[\\\\/]|[\\\\/]\\.\\.)",
        Pattern.CASE_INSENSITIVE
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // Validate request parameters
        if (containsMaliciousInput(request)) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid input detected\",\"message\":\"Request contains potentially malicious content.\"}");
            return;
        }
        
        // Validate request headers
        if (containsMaliciousHeaders(request)) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid headers detected\",\"message\":\"Request headers contain potentially malicious content.\"}");
            return;
        }
        
        // Validate request URI
        if (containsMaliciousUri(request)) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid URI detected\",\"message\":\"Request URI contains potentially malicious content.\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean containsMaliciousInput(HttpServletRequest request) {
        // Check query parameters
        if (request.getQueryString() != null) {
            String queryString = request.getQueryString();
            if (isMaliciousInput(queryString)) {
                return true;
            }
        }
        
        // Check form parameters
        request.getParameterMap().forEach((key, values) -> {
            for (String value : values) {
                if (isMaliciousInput(value)) {
                    // Cannot return from lambda, so we'll throw an exception
                    throw new SecurityException("Malicious input detected in parameter: " + key);
                }
            }
        });
        
        return false;
    }

    private boolean containsMaliciousHeaders(HttpServletRequest request) {
        var headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            if (headerValue != null && isMaliciousInput(headerValue)) {
                return true;
            }
        }
        return false;
    }

    private boolean containsMaliciousUri(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return isMaliciousInput(uri);
    }

    private boolean isMaliciousInput(String input) {
        if (input == null || input.trim().isEmpty()) {
            return false;
        }
        
        // Check for SQL injection patterns
        if (SQL_INJECTION_PATTERN.matcher(input).find()) {
            return true;
        }
        
        // Check for XSS patterns
        if (XSS_PATTERN.matcher(input).find()) {
            return true;
        }
        
        // Check for path traversal patterns
        if (PATH_TRAVERSAL_PATTERN.matcher(input).find()) {
            return true;
        }
        
        // Check for null bytes
        if (input.contains("\0")) {
            return true;
        }
        
        // Check for excessive length (potential buffer overflow)
        if (input.length() > 10000) {
            return true;
        }
        
        return false;
    }
}