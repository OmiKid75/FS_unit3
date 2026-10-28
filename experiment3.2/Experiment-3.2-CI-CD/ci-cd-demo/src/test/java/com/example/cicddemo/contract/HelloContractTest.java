package com.example.cicddemo.contract;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import au.com.dius.pact.consumer.MockServer;
import au.com.dius.pact.consumer.dsl.PactDslWithProvider;
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt;
import au.com.dius.pact.consumer.junit5.PactTestFor;
import au.com.dius.pact.core.model.RequestResponsePact;
import au.com.dius.pact.core.model.annotations.Pact;

@ExtendWith(PactConsumerTestExt.class)
class HelloContractTest {

    @Pact(provider = "hello-provider", consumer = "hello-consumer")
    RequestResponsePact helloContract(PactDslWithProvider builder) {
        return builder
                .given("the hello service is available")
                .uponReceiving("a request for the health endpoint")
                .path("/health")
                .method("GET")
                .willRespondWith()
                .status(200)
                .headers(java.util.Map.of("Content-Type", "application/json"))
                .body("{\"status\":\"UP\"}")
                .toPact();
    }

    @Test
    @PactTestFor(pactMethod = "helloContract")
    void providerHealthResponseMatchesContract(MockServer mockServer) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(mockServer.getUrl() + "/health"))
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        org.junit.jupiter.api.Assertions.assertTrue(response.body().contains("\"status\":\"UP\""));
    }
}
