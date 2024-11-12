#!/bin/bash

# Check for environment flag
if [ "$1" == "--local" ]; then
    ENV_VAR="http://localhost"
    ENV_TAG="local"
elif [ "$1" == "--dev" ]; then
    ENV_VAR="http://ec2-13-201-85-148.ap-south-1.compute.amazonaws.com"
    ENV_TAG="dev"
elif [ "$1" == "--prod" ]; then
    ENV_VAR="https://llmgateway.oderna.in/"
    ENV_TAG="prod"
else
    echo "Error: Please specify either --local, --dev or --prod"
    exit 1
fi

# Define image name as a variable to make it easier to maintain
IMAGE_NAME="subhomoy/llm-gateway-console"
TAG=$(date +"%Y%m%d%H%M%S")
VERSIONED_TAG="$IMAGE_NAME:$TAG-$ENV_TAG"
LATEST_TAG="$IMAGE_NAME:latest-$ENV_TAG"

echo "[+] Building Image with tag: $TAG-$ENV_TAG..."
docker build --build-arg NEXT_PUBLIC_API_URL=$ENV_VAR -t $VERSIONED_TAG .

echo "[+] Tagging Image as latest-$ENV_TAG..."
docker tag $VERSIONED_TAG $LATEST_TAG

echo "[+] Pushing Images to Docker Hub..."
docker push $VERSIONED_TAG
docker push $LATEST_TAG

echo "[+] Finished"
