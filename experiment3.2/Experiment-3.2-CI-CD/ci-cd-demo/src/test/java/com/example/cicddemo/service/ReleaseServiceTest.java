package com.example.cicddemo.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ReleaseServiceTest {
    private final ReleaseService service = new ReleaseService();

    @Test
    void greetingUsesProvidedName() {
        assertEquals("Hello, Naomi!", service.greeting(" Naomi "));
    }

    @Test
    void greetingUsesDefaultForBlankName() {
        assertEquals("Hello, learner!", service.greeting("  "));
    }
}
