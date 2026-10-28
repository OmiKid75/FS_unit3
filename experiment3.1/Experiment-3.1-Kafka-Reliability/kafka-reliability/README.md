# Experiment 3.1 — Kafka Reliability Demo

This project combines the practicals for Experiments 3.1.1 and 3.1.2.

## Aim
Implement reliability mechanisms in an event-driven system using exponential-backoff retries, a dead-letter topic (DLQ), and idempotent event processing.

## Requirements
- JDK 17+
- Docker Desktop running
- VS Code
- Internet access for the first Maven/Docker downloads

## Start Kafka
From this folder, run:

```powershell
docker compose up -d
docker compose ps
```

Kafka is exposed at `localhost:9092`.

## Run the Spring Boot application
Open a terminal in the folder containing `pom.xml`, then run:

```powershell
.\mvnw.cmd spring-boot:run
```

If the generated project does not include Maven Wrapper, use `mvn spring-boot:run` if Maven is installed.

## Postman demonstrations

### 1. Successful event
POST `http://localhost:8080/api/posts`

Body → raw → JSON:

```json
{
  "content": "Publish the scheduled post",
  "eventId": "event-1001"
}
```

Expected: HTTP 202 Accepted and an event ID. Check the application terminal for a SUCCESS log.

### 2. Retry and DLQ
POST `http://localhost:8080/api/posts`

```json
{
  "content": "FAIL simulate a permanent failure",
  "eventId": "event-fail-1001"
}
```

Expected: consumer logs show repeated attempts with increasing delays, then a DLQ log after retries are exhausted. Spring Kafka creates retry topics and a DLT topic automatically. Topic names are derived from `scheduled-posts` and Spring Kafka's retry-topic naming rules; the configured DLT suffix is `-dlt`.

### 3. Idempotency
Send the same successful event twice with exactly the same `eventId`, for example `event-duplicate-1`. The first message is processed; the duplicate is ignored if the first message has already completed. Check logs for `IDEMPOTENCY`.

Because Kafka processing is asynchronous, wait for the first message to finish before sending the duplicate.

### 4. Check status
GET `http://localhost:8080/api/posts/status`

GET `http://localhost:8080/api/posts/status/event-1001`

## Stop Kafka
```powershell
docker compose down
```

## Important implementation note
The idempotency store uses an in-memory concurrent set to keep the practical easy to run. It prevents duplicates during one application run, but resets on restart and is not a substitute for a durable database-backed idempotency table in production.

## Experiment outcomes
- Failed events retried with exponential backoff.
- Events that exceed retry attempts routed to a dead-letter topic.
- Duplicate event IDs ignored after successful processing.
- REST endpoint lets the user trigger demonstrations through Postman.
