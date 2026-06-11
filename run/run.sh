IMAGE_NAME=client
CONTAINER_NAME=temp_client

cp ../client.tar.gz .

docker rm -f $CONTAINER_NAME
docker rmi -f $IMAGE_NAME

docker build -t $IMAGE_NAME --platform linux/amd64  --progress=plain --no-cache .
# docker run --name $CONTAINER_NAME -d $IMAGE_NAME