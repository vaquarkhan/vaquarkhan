package com.cardlinked.benefits.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.cardlinked.benefits.auth.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class JwtService {

    @Value("${spring.security.jwt.secret}")
    private String jwtSecret;

    @Value("${spring.security.jwt.expiration:86400000}") // 24 hours default
    private Long jwtExpiration;

    private final RedisTemplate<String, Object> redisTemplate;
    private final Algorithm algorithm;

    public JwtService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        // Algorithm will be initialized in @PostConstruct
        this.algorithm = null;
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        // Initialize algorithm after properties are injected
    }

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(jwtSecret);
    }

    /**
     * Generate JWT token for user
     */
    public String generateToken(User user) {
        try {
            Date expirationDate = new Date(System.currentTimeMillis() + jwtExpiration);
            
            String token = JWT.create()
                    .withSubject(user.getUsername())
                    .withClaim("userId", user.getUserId())
                    .withClaim("email", user.getEmail())
                    .withClaim("fullName", user.getFullName())
                    .withClaim("department", user.getDepartment())
                    .withClaim("roles", user.getRoleNames())
                    .withClaim("permissions", user.getPermissionNames())
                    .withIssuedAt(new Date())
                    .withExpiresAt(expirationDate)
                    .withIssuer("card-benefits-platform")
                    .sign(getAlgorithm());

            // Store token in Redis for session management
            storeTokenInRedis(user.getUserId(), token, jwtExpiration);
            
            return token;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error creating JWT token", e);
        }
    }

    /**
     * Generate refresh token
     */
    public String generateRefreshToken(User user) {
        try {
            Date expirationDate = new Date(System.currentTimeMillis() + (jwtExpiration * 7)); // 7 times longer
            
            String refreshToken = JWT.create()
                    .withSubject(user.getUsername())
                    .withClaim("userId", user.getUserId())
                    .withClaim("tokenType", "refresh")
                    .withIssuedAt(new Date())
                    .withExpiresAt(expirationDate)
                    .withIssuer("card-benefits-platform")
                    .sign(getAlgorithm());

            // Store refresh token in Redis
            storeRefreshTokenInRedis(user.getUserId(), refreshToken, jwtExpiration * 7);
            
            return refreshToken;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error creating refresh token", e);
        }
    }

    /**
     * Validate and decode JWT token
     */
    public DecodedJWT validateToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(getAlgorithm())
                    .withIssuer("card-benefits-platform")
                    .build();
            
            DecodedJWT decodedJWT = verifier.verify(token);
            
            // Check if token exists in Redis (not blacklisted)
            String userId = decodedJWT.getClaim("userId").asString();
            if (!isTokenValidInRedis(userId, token)) {
                throw new JWTVerificationException("Token has been invalidated");
            }
            
            return decodedJWT;
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    /**
     * Extract username from token
     */
    public String extractUsername(String token) {
        DecodedJWT decodedJWT = validateToken(token);
        return decodedJWT.getSubject();
    }

    /**
     * Extract user ID from token
     */
    public String extractUserId(String token) {
        DecodedJWT decodedJWT = validateToken(token);
        return decodedJWT.getClaim("userId").asString();
    }

    /**
     * Extract roles from token
     */
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        DecodedJWT decodedJWT = validateToken(token);
        return decodedJWT.getClaim("roles").asList(String.class);
    }

    /**
     * Extract permissions from token
     */
    @SuppressWarnings("unchecked")
    public List<String> extractPermissions(String token) {
        DecodedJWT decodedJWT = validateToken(token);
        return decodedJWT.getClaim("permissions").asList(String.class);
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            return decodedJWT.getExpiresAt().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * Invalidate token (add to blacklist)
     */
    public void invalidateToken(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            String userId = decodedJWT.getClaim("userId").asString();
            
            // Remove from active tokens
            removeTokenFromRedis(userId, token);
            
            // Add to blacklist
            addTokenToBlacklist(token, decodedJWT.getExpiresAt());
        } catch (Exception e) {
            // Token might be malformed, but we still want to blacklist it
            addTokenToBlacklist(token, new Date(System.currentTimeMillis() + jwtExpiration));
        }
    }

    /**
     * Invalidate all tokens for a user
     */
    public void invalidateAllUserTokens(String userId) {
        String tokenKey = "user_tokens:" + userId;
        String refreshTokenKey = "user_refresh_tokens:" + userId;
        
        redisTemplate.delete(tokenKey);
        redisTemplate.delete(refreshTokenKey);
    }

    /**
     * Refresh access token using refresh token
     */
    public String refreshAccessToken(String refreshToken, User user) {
        try {
            DecodedJWT decodedJWT = validateRefreshToken(refreshToken);
            String userId = decodedJWT.getClaim("userId").asString();
            
            if (!userId.equals(user.getUserId())) {
                throw new RuntimeException("Refresh token does not belong to user");
            }
            
            return generateToken(user);
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token", e);
        }
    }

    /**
     * Validate refresh token
     */
    private DecodedJWT validateRefreshToken(String refreshToken) {
        try {
            JWTVerifier verifier = JWT.require(getAlgorithm())
                    .withIssuer("card-benefits-platform")
                    .withClaim("tokenType", "refresh")
                    .build();
            
            DecodedJWT decodedJWT = verifier.verify(refreshToken);
            
            // Check if refresh token exists in Redis
            String userId = decodedJWT.getClaim("userId").asString();
            if (!isRefreshTokenValidInRedis(userId, refreshToken)) {
                throw new JWTVerificationException("Refresh token has been invalidated");
            }
            
            return decodedJWT;
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid refresh token", e);
        }
    }

    // Redis operations
    private void storeTokenInRedis(String userId, String token, Long expiration) {
        String key = "user_tokens:" + userId;
        redisTemplate.opsForSet().add(key, token);
        redisTemplate.expire(key, expiration, TimeUnit.MILLISECONDS);
    }

    private void storeRefreshTokenInRedis(String userId, String refreshToken, Long expiration) {
        String key = "user_refresh_tokens:" + userId;
        redisTemplate.opsForSet().add(key, refreshToken);
        redisTemplate.expire(key, expiration, TimeUnit.MILLISECONDS);
    }

    private boolean isTokenValidInRedis(String userId, String token) {
        String key = "user_tokens:" + userId;
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, token));
    }

    private boolean isRefreshTokenValidInRedis(String userId, String refreshToken) {
        String key = "user_refresh_tokens:" + userId;
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, refreshToken));
    }

    private void removeTokenFromRedis(String userId, String token) {
        String key = "user_tokens:" + userId;
        redisTemplate.opsForSet().remove(key, token);
    }

    private void addTokenToBlacklist(String token, Date expirationDate) {
        String key = "blacklisted_tokens:" + token;
        long ttl = expirationDate.getTime() - System.currentTimeMillis();
        if (ttl > 0) {
            redisTemplate.opsForValue().set(key, "blacklisted", ttl, TimeUnit.MILLISECONDS);
        }
    }

    private boolean isTokenBlacklisted(String token) {
        String key = "blacklisted_tokens:" + token;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * Get token expiration time
     */
    public LocalDateTime getTokenExpiration(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            return decodedJWT.getExpiresAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get remaining token validity time in seconds
     */
    public long getRemainingValidityTime(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            long expirationTime = decodedJWT.getExpiresAt().getTime();
            long currentTime = System.currentTimeMillis();
            return Math.max(0, (expirationTime - currentTime) / 1000);
        } catch (Exception e) {
            return 0;
        }
    }
}