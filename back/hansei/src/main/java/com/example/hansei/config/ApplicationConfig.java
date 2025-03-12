package com.example.hansei.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationConfig {

    // 📌 RestTemplate Bean 등록
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
