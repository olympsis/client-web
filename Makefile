VERSION ?= v0.2.2
PROJECT_ID := olympsis-485522
LOCATION := us-central1-docker.pkg.dev
SERVICE_NAME := client-web

IMAGE_NAME ?= olympsis-web

# Build production Docker image
image:
	docker build --build-arg ENV_FILE=.env -t $(IMAGE_NAME) .

# Build dev Docker image
image-dev:
	docker build -f Dockerfile.dev --build-arg ENV_FILE=.env.dev -t $(IMAGE_NAME)-dev .

# Build and push to GCP Artifact Registry
artifact:
	docker build --build-arg ENV_FILE=.env.prod -t $(IMAGE_NAME) --platform linux/amd64 .
	docker tag $(IMAGE_NAME) $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/release:$(VERSION)
	docker push $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/release:$(VERSION)

artifact-dev:
	docker build -f Dockerfile.dev --build-arg ENV_FILE=.env.dev -t $(IMAGE_NAME)-dev --platform linux/amd64 .
	docker tag $(IMAGE_NAME)-dev $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/dev:$(VERSION)
	docker push $(LOCATION)/$(PROJECT_ID)/$(SERVICE_NAME)/dev:$(VERSION)
