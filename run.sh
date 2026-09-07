#!/usr/bin/env bash
set -euo pipefail

if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker daemon is not running (or you don't have permission to talk to it)" >&2
    exit 1
fi

REPO_NAME=commando-client
IMAGE_NAME=client
CONTAINER_NAME=temp_client
CONTAINER_FILE_PATH="/home/app/client.tar.gz"

OUTPUT_DIR="$(pwd)"

WORK_DIR="$(mktemp -d "/tmp/${REPO_NAME}.XXXXXX")"

cleanup() {
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
    docker rmi -f "$IMAGE_NAME" >/dev/null 2>&1 || true
    rm -rf "$WORK_DIR"
}
trap cleanup EXIT

git clone "git@github.com:BIData373/${REPO_NAME}.git" --depth=1 "$WORK_DIR/$REPO_NAME"
cd "$WORK_DIR/$REPO_NAME"
git checkout dev

docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker rmi -f "$IMAGE_NAME" >/dev/null 2>&1 || true
docker build -t "$IMAGE_NAME" --platform linux/amd64 .
docker run -d --name "$CONTAINER_NAME" "$IMAGE_NAME"
docker cp "$CONTAINER_NAME:$CONTAINER_FILE_PATH" "$OUTPUT_DIR/"

echo "Done. Output copied to $OUTPUT_DIR/$(basename "$CONTAINER_FILE_PATH")"    