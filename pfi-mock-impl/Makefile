SHELL := /bin/bash

#! TODO: check if services are already running before bringing them up
.PHONY: dev-up
dev-up:
	@echo "Starting docker containers for all necessary services"
	docker-compose -f $(PWD)/docker-compose.yml up --abort-on-container-exit

.PHONY: dev-down
dev-down:
	@echo "Stopping docker containers"
	docker-compose -f $(PWD)/docker-compose.yml down


#! TODO: add `dev-up` as a dependency task
.PHONY: test
test:
test-local: 
	@echo "Running tests on host machine"
	../gradlew test
