# PFI Mock Implementation

## Introduction
**TODO**: Fill out

- Supports USD -> USDC on-ramp
- Stores messages in MySQL

## Contributing

### Pre-requisites
- Java 15
- Docker

This repository contains a `docker-compose.yml` which defines all of the services that this implementation depends on (e.g. mysql). Running this application or integration tests requires that these services are running. Starting all of the necessary docker containers can be done by running `make dev-up`. When you're done, simply run `make dev-down`

### Running Tests
`make test`
