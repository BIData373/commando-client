docker rm -f client
docker rmi client

docker build -t client .
docker run --name client -e PORT=8080 -d -p 8080:8080 client

