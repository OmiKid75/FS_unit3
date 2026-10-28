package com.example.kafkareliability.model;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public class ScheduledPostEvent {
    @NotBlank
    private String eventId;
    @NotBlank
    private String content;
    private Instant scheduledAt;

    public ScheduledPostEvent() {
    }

    public ScheduledPostEvent(String eventId, String content, Instant scheduledAt) {
        this.eventId = eventId;
        this.content = content;
        this.scheduledAt = scheduledAt;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }
}
