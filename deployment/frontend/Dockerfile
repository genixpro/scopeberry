# This builds an all-in-one easy to install dockerfile

FROM       python:3.6.8
MAINTAINER PlanGuru <genixpro@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash

# Install some basic system dependencies
RUN apt-get update && apt-get install \
    nginx \
    supervisor \
    nodejs -y  && \
    rm -rf /var/lib/apt/lists/* && \
        rm -rf /usr/share/doc/* && \
        rm -rf /usr/share/icons/* && \
        rm -rf /usr/share/man/*

# Set the working directory to /app
WORKDIR /planguru

# We add package.json first so that the  docker image build
# can use the cache as long as contents of package.json
# hasn't changed.
RUN mkdir /planguru/client
COPY client/package.json /planguru/client
WORKDIR /planguru/client
RUN npm install && \
        rm -rf /root/.npm/_cacache && \
        rm -rf /var/cache/*

ARG PLANGURU_ENV

# Copy the NGINX configuration
ADD deployment/frontend/nginx_config /etc/nginx/sites-enabled/default
RUN sed "s/__PLANGURU_ENV__/${PLANGURU_ENV}/g" -i /etc/nginx/sites-enabled/default
ADD deployment/ssl/planguru.key /etc/nginx/ssl/nginx.key
ADD deployment/ssl/certbundle.pem /etc/nginx/ssl/nginx.pem

# Copy the current directory contents into the container at /planguru
ADD client /planguru/client

# Set the working directory to /planguru/client, and build the frontend package
WORKDIR /planguru/client
ENV PLANGURU_ENV=${PLANGURU_ENV}
ENV REVISION_ID=${REVISION_ID}

RUN cp .env.${PLANGURU_ENV} .env.chosen
RUN rm .env.production
RUN mv .env.chosen .env.production

# Build the frontend static files and delete all the planguru code, nodejs and python to trim down the image size
RUN npm run-script build && \
        mkdir /build && \
        mv build/* /build && \
        rm -rf /planguru && \
        apt-get purge nodejs python3 -y && \
        rm -rf /root/.npm && \
        rm -rf /var/lib/dpkg/* && \
        rm -rf /usr/include/*

RUN mkdir -p /var/log/supervisord
COPY deployment/frontend/supervisord.conf /etc/supervisor/supervisord.conf

# Setup and configure systemd
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf", "-n"]
EXPOSE 80
EXPOSE 443
