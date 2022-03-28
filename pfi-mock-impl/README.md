# PFI Mock Implementation

## Introduction
This is a mock implementation of a PFI (Participating Financial Institution) for the tbDex protocol. It is leveraging Circle's APIs in order to facilitate the on and off ramps.

The state machine from the perspective of the PFI:
```mermaid
graph TD
    A[Receive Ask] --> B{Conditional Offer}
    B -->|Denied| C[Close Offer]
    B -->|Accepted| D[Request IDV]
    D --> |Send Credentials| E{Evaluate IDV Risk}
    E --> |Soft Fail| D
    E --> |Hard Fail| C
    E --> |Passed| G[Request Payment Info]
    G --> |Send Payment Info| H{Evaluate Payment Risk}
    H --> |Hard Fail| C
    H --> |Soft Fail| D
    H --> |Passed| I{Capture Funds}
    I --> |Failed| G
    I --> |Passed| J[Release Funds]
```
- Supports USD -> USDC on-ramp
- Supports USDC -> USD off-ramp
- Stores messages in MySQL

## Contributing
[CONTRIBUTING.md](CONTRIBUTING.md)

### Pre-requisites
- Java 17
- Docker
- docker-compose

This repository contains a `docker-compose.yml` which defines all of the services that this implementation depends on (e.g. mysql). Running this application or integration tests requires that these services are running. Starting all of the necessary docker containers can be done by running `make dev-up`. When you're done, simply run `make dev-down`

### Running Tests
`make test`
