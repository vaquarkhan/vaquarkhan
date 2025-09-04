package com.turboagile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main Spring Boot Application Class
 * TurboAgile Enhanced - Full-Stack Development Platform
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
public class TurboAgileApplication {

    public static void main(String[] args) {
        SpringApplication.run(TurboAgileApplication.class, args);
        System.out.println("🚀 TurboAgile Enhanced Application Started Successfully!");
        System.out.println("📚 API Documentation: http://localhost:8080/api/swagger-ui.html");
        System.out.println("🏥 Health Check: http://localhost:8080/api/actuator/health");
        System.out.println("📊 Actuator: http://localhost:8080/api/actuator");
    }
}
