package com.example.cicddemo.integration;

import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Testcontainers(disabledWithoutDocker = true)
class PostgresContainerSmokeTest {
    @Container
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("ci_demo")
                    .withUsername("test")
                    .withPassword("test");

    @Test
    void canConnectToRealPostgresContainer() throws Exception {
        try (Connection connection = DriverManager.getConnection(
                postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
             Statement statement = connection.createStatement()) {
            statement.execute("CREATE TABLE ci_smoke (id INT PRIMARY KEY, note VARCHAR(50))");
            statement.execute("INSERT INTO ci_smoke VALUES (1, 'container works')");
            try (ResultSet rs = statement.executeQuery("SELECT COUNT(*) FROM ci_smoke")) {
                rs.next();
                assertEquals(1, rs.getInt(1));
            }
        }
    }
}
