FROM registry.access.redhat.com/ubi9/nodejs-22

USER root

ARG APP_DIR=/home/app

WORKDIR $APP_DIR

RUN chmod -R 777 $APP_DIR

ADD . .

RUN npm install

RUN cp -a . /tmp/archive

RUN tar -czf client.tar.gz /tmp/archive

CMD ["tail", "-f", "/dev/null"]