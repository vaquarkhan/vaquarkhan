package com.cardlinked.benefits.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SsoUserInfo {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String provider;
    private String externalId;
}