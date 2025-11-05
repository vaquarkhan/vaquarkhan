package com.cardlinked.benefits.security.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * TLS 1.3 Configuration for production environments
 * Ensures secure communication for banking applications
 */
@Configuration
@Profile({"staging", "prod"})
public class TlsConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> servletContainer() {
        return factory -> {
            factory.addConnectorCustomizers(connector -> {
                // Enable TLS 1.3 only
                connector.setProperty("sslEnabledProtocols", "TLSv1.3");
                
                // Strong cipher suites for banking
                connector.setProperty("ciphers", 
                    "TLS_AES_256_GCM_SHA384," +
                    "TLS_CHACHA20_POLY1305_SHA256," +
                    "TLS_AES_128_GCM_SHA256"
                );
                
                // Disable weak protocols and ciphers
                connector.setProperty("sslProtocol", "TLSv1.3");
                connector.setProperty("clientAuth", "false");
                connector.setProperty("sslVerifyClient", "none");
                
                // HSTS settings
                connector.setProperty("useServerCipherSuitesOrder", "true");
                connector.setProperty("honorCipherOrder", "true");
                
                // Session settings
                connector.setProperty("sessionCacheSize", "20480");
                connector.setProperty("sessionTimeout", "300");
            });
        };
    }
}