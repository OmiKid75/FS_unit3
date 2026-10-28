package com.example.kafkareliability.service;

import com.example.kafkareliability.model.ScheduledPostEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ScheduledPostProducer {
    private final KafkaTemplate<String, ScheduledPostEvent> kafkaTemplate;
    private final String topic;

    public ScheduledPostProducer(
            KafkaTemplate<String, ScheduledPostEvent> kafkaTemplate,
            @Value("${app.kafka.posts-topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publish(ScheduledPostEvent event) {
        kafkaTemplate.send(topic, event.getEventId(), event);
    }
}
