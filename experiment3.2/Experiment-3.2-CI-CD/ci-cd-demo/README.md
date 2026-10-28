# Experiment 3.2 — CI/CD Demo

This project combines Experiment 3.2.1 (Continuous Integration) and Experiment 3.2.2 (Continuous Deployment).

## Included demonstrations
- JUnit 5 unit tests
- Spring MockMvc API integration tests
- Pact consumer contract test
- Testcontainers PostgreSQL smoke test (automatically skipped when Docker is unavailable)
- GitHub Actions CI workflow
- Dockerfile and Docker Compose stable/canary services
- GitHub Actions workflow to test and publish a Docker image to Docker Hub

## Requirements
- Java 17+
- Maven 3.9+ (or Maven Wrapper added locally)
- Docker Desktop
- Git and GitHub account
- Docker Hub account for image publishing

## 1. Run tests locally
Open a terminal in the folder containing `pom.xml`:

```powershell
mvn test
```

Testcontainers will use Docker to start PostgreSQL for its smoke test. If Docker is not running, that test is skipped.

## 2. Run the application
```powershell
mvn spring-boot:run
```

Try:
- `GET http://localhost:8080/health`
- `GET http://localhost:8080/api/hello?name=Student`
- `GET http://localhost:8080/api/version`

## 3. Build and run Docker image
```powershell
docker build -t ci-cd-demo:local .
docker run --rm -p 8080:8080 ci-cd-demo:local
```

## 4. Canary release demonstration
Run the stable version:

```powershell
docker compose up -d --build stable
```

In a second terminal, start the canary version:

```powershell
docker compose --profile canary up -d --build canary
```

Check each version:
- Stable: `http://localhost:8080/api/version` (version 1.0.0, track stable)
- Canary: `http://localhost:8081/api/version` (version 1.1.0, track canary)

This is a local canary demonstration with two independently addressable instances. It does not automatically split live user traffic or promote canary to 100%; production traffic shifting would require a load balancer or deployment platform.

Stop the containers:

```powershell
docker compose --profile canary down
```

## 5. GitHub Actions
Push the project to GitHub. The workflow `.github/workflows/ci.yml` runs on pushes and pull requests to `main`, executes tests, and builds a Docker image.

To publish an image, add these repository secrets in GitHub → Settings → Secrets and variables → Actions:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (a Docker Hub access token, not your password)

Then run the **CD - Build and Publish Docker Image** workflow manually, or push a tag beginning with `v`, such as `v1.0.0`.

The workflow publishes the image but does not remotely deploy to a cloud server. The canary strategy is demonstrated locally using Docker Compose.

## Notes
- Do not commit credentials or tokens.
- Pact test here demonstrates consumer-side contract creation and verification against a Pact mock server; a full provider verification workflow can be added when a separate provider service is available.
- This starter package has not been built in this environment; run `mvn test` locally and share any error output for troubleshooting.
