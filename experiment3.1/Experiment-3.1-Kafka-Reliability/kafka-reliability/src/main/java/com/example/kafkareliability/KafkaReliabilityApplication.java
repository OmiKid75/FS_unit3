package com.example.kafkareliability;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.EnableKafkaRetryTopic;

@SpringBootApplication
@EnableKafka
@EnableKafkaRetryTopic
public class KafkaReliabilityApplication {
    public static void main(String[] args) {
        SpringApplication.run(KafkaReliabilityApplication.class, args);
    }
}
