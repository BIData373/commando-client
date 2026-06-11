FROM registry.access.redhat.com/ubi9/nodejs-22

USER root

ARG APP_DIR=/home/app

WORKDIR $APP_DIR

COPY client.tar.gz .

RUN tar -xzf client.tar.gz

RUN rm -rf client.tar.gz

RUN cp -a tmp/archive/* . && rm -rf tmp/archive

RUN ls node_modules/ | grep lefthook | tee /dev/stderr

# RUN npm run build

# EXPOSE 8080

# ENTRYPOINT ["tail", "-f", "/dev/null"]