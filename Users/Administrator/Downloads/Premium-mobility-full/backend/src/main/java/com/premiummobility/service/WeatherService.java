package com.premiummobility.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiKey;
    private final String units;

    public WeatherService(RestTemplate restTemplate,
                          @Value("${weather.api.base-url}") String baseUrl,
                          @Value("${weather.api.key}") String apiKey,
                          @Value("${weather.api.units:metric}") String units) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.units = units;
    }

    public Map<String, Object> getCurrentWeather(Double latitude, Double longitude, String locationQuery) {
        if (!StringUtils.hasText(apiKey)) {
            throw new IllegalStateException("Weather API key is not configured");
        }

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/weather")
                .queryParam("appid", apiKey)
                .queryParam("units", units);

        if (latitude != null && longitude != null) {
            uriBuilder.queryParam("lat", latitude)
                    .queryParam("lon", longitude);
        } else if (StringUtils.hasText(locationQuery)) {
            uriBuilder.queryParam("q", locationQuery);
        } else {
            throw new IllegalArgumentException("Either latitude/longitude or location query must be provided");
        }

        String url = uriBuilder.toUriString();
        log.debug("Calling weather API: {}", url);
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return response;
        } catch (RestClientException ex) {
            log.error("Failed to fetch weather data", ex);
            throw new IllegalStateException("Unable to fetch weather data: " + ex.getMessage(), ex);
        }
    }
}
