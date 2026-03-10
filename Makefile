VERSION ?= v0.1.4
PROJECT_ID := olympsis-485522
LOCATION := us-central1-docker.pkg.dev
SERVICE_NAME := client-web

ENV_FILE ?= .env
IMAGE_NAME ?= olympsis-web

# Reads KEY=VALUE lines from an env file, skipping comments and blank lines
BUILD_ARGS = $(shell grep -v '^\s*\#' $(1) | grep -v '^\s*$$' | sed 's/^/--build-arg /' | tr '\n' ' ')

# Build production Docker image with secrets from .env file
image:
	docker build $(call BUILD_ARGS,$(ENV_FILE)) -t $(IMAGE_NAME) .

# Build dev Docker image with secrets from .env.dev file
image-dev:
	docker build -f Dockerfile.dev $(call BUILD_ARGS,.env.dev) -t $(IMAGE_NAME)-dev .

# Build and push to GCP Artifact Registry
artifact:
	docker build $(call BUILD_ARGS,.env.prod) -t $(IMAGE_NAME) --platform linux/amd64 .
	docker tag $(IMAGE_NAME) $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/release:$(VERSION)
	docker push $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/release:$(VERSION)

artifact-dev:
	docker build -f Dockerfile.dev $(call BUILD_ARGS,.env.dev) -t $(IMAGE_NAME)-dev --platform linux/amd64 .
	docker tag $(IMAGE_NAME)-dev $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/dev:$(VERSION)
	docker push $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/dev:$(VERSION)
