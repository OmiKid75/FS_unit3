package com.example.kafkareliability.service;

import com.example.kafkareliability.model.ScheduledPostEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ScheduledPostConsumer {
    private static final Logger log = LoggerFactory.getLogger(ScheduledPostConsumer.class);

    // Demo-only idempotency store. It survives concurrent calls in this process,
    // but not application restarts. Production systems should persist event IDs.
    private final Set<String> processedEventIds = ConcurrentHashMap.newKeySet();
    private final ConcurrentHashMap<String, AtomicInteger> attemptsByEvent = new ConcurrentHashMap<>();

    @RetryableTopic(
            attempts = "4",
            backoff = @Backoff(delay = 1000, multiplier = 2.0, maxDelay = 8000),
            topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE,
            dltTopicSuffix = "-dlt",
            autoCreateTopics = true
    )
    @KafkaListener(topics = "${app.kafka.posts-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(ScheduledPostEvent event) {
        if (event == null || event.getEventId() == null || event.getEventId().isBlank()) {
            throw new IllegalArgumentException("Event ID is required");
        }

        if (processedEventIds.contains(event.getEventId())) {
            log.warn("IDEMPOTENCY: duplicate event {} ignored", event.getEventId());
            return;
        }

        int attempt = attemptsByEvent
                .computeIfAbsent(event.getEventId(), ignored -> new AtomicInteger())
                .incrementAndGet();

        log.info("Processing eventId={}, attempt={}, content={}",
                event.getEventId(), attempt, event.getContent());

        // For demonstration, any content beginning with FAIL keeps failing,
        // so retries and DLQ routing can be observed in the logs.
        if (event.getContent() != null && event.getContent().startsWith("FAIL")) {
            throw new IllegalStateException("Simulated processing failure for " + event.getEventId());
        }

        // Mark processed only after business processing succeeds.
        processedEventIds.add(event.getEventId());
        log.info("SUCCESS: event {} processed once", event.getEventId());
    }

    @DltHandler
    public void handleDeadLetter(ScheduledPostEvent event) {
        log.error("DLQ: event {} moved to dead-letter topic after retries. Content={}",
                event == null ? "unknown" : event.getEventId(),
                event == null ? "unknown" : event.getContent());
    }

    public int processedCount() {
        return processedEventIds.size();
    }

    public boolean wasProcessed(String eventId) {
        return processedEventIds.contains(eventId);
    }
}
