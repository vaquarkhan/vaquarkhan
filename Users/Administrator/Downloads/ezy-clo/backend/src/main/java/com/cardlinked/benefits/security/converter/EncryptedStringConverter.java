package com.cardlinked.benefits.security.converter;

import com.cardlinked.benefits.security.service.EncryptionService;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * JPA Attribute Converter for automatic encryption/decryption of string fields
 */
@Converter
@Component
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    private static EncryptionService encryptionService;

    @Autowired
    public void setEncryptionService(EncryptionService encryptionService) {
        EncryptedStringConverter.encryptionService = encryptionService;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return attribute;
        }
        
        // Only encrypt if not already encrypted
        if (encryptionService.isEncrypted(attribute)) {
            return attribute;
        }
        
        return encryptionService.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return dbData;
        }
        
        // Only decrypt if it's encrypted
        if (encryptionService.isEncrypted(dbData)) {
            return encryptionService.decrypt(dbData);
        }
        
        return dbData;
    }
}