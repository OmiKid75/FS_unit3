package com.example.cicddemo.service;

import org.springframework.stereotype.Service;

@Service
public class ReleaseService {
    public String greeting(String name) {
        if (name == null || name.isBlank()) {
            return "Hello, learner!";
        }
        return "Hello, " + name.trim() + "!";
    }

    public String version() {
        return System.getenv().getOrDefault("APP_VERSION", "1.0.0");
    }

    public String releaseTrack() {
        return System.getenv().getOrDefault("RELEASE_TRACK", "stable");
    }
}
