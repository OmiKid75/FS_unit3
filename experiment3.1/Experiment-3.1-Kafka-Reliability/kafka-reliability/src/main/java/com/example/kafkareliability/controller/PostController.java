package com.example.kafkareliability.controller;

import com.example.kafkareliability.model.ScheduledPostEvent;
import com.example.kafkareliability.service.ScheduledPostConsumer;
import com.example.kafkareliability.service.ScheduledPostProducer;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final ScheduledPostProducer producer;
    private final ScheduledPostConsumer consumer;

    public PostController(ScheduledPostProducer producer, ScheduledPostConsumer consumer) {
        this.producer = producer;
        this.consumer = consumer;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, Object> schedulePost(@Valid @RequestBody CreatePostRequest request) {
        String eventId = (request.eventId() == null || request.eventId().isBlank())
                ? UUID.randomUUID().toString()
                : request.eventId();

        ScheduledPostEvent event = new ScheduledPostEvent(eventId, request.content(),
                request.scheduledAt() == null ? Instant.now() : request.scheduledAt());
        producer.publish(event);

        return Map.of(
                "message", "Event accepted for asynchronous processing",
                "eventId", eventId,
                "topic", "scheduled-posts",
                "hint", "Use content starting with FAIL to demonstrate retries and DLQ"
        );
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of("processedUniqueEventCount", consumer.processedCount());
    }

    @GetMapping("/status/{eventId}")
    public Map<String, Object> eventStatus(@PathVariable String eventId) {
        return Map.of(
                "eventId", eventId,
                "processed", consumer.wasProcessed(eventId),
                "note", "Status is in-memory demo state; it resets when the application restarts."
        );
    }

    public record CreatePostRequest(
            @NotBlank String content,
            String eventId,
            Instant scheduledAt
    ) {}
}
