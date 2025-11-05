package com.cardlinked.benefits.auth.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    /**
     * Load user by username for authentication
     */
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO: Implement user loading logic
        // This should load user from database and return UserDetails
        throw new UsernameNotFoundException("User not found: " + username);
    }
}