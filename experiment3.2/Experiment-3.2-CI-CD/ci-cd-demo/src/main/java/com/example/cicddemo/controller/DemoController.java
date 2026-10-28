package com.example.cicddemo.controller;

import com.example.cicddemo.service.ReleaseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DemoController {
    private final ReleaseService releaseService;

    public DemoController(ReleaseService releaseService) {
        this.releaseService = releaseService;
    }

    @GetMapping("/api/hello")
    public Map<String, String> hello(@RequestParam(required = false) String name) {
        return Map.of("message", releaseService.greeting(name));
    }

    @GetMapping("/api/version")
    public Map<String, String> version() {
        return Map.of(
                "version", releaseService.version(),
                "releaseTrack", releaseService.releaseTrack()
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
