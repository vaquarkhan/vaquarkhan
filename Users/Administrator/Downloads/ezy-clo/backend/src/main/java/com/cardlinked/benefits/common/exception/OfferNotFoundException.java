package com.cardlinked.benefits.common.exception;

public class OfferNotFoundException extends RuntimeException {
    
    public OfferNotFoundException(String message) {
        super(message);
    }
    
    public OfferNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}