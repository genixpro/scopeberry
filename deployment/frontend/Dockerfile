# This builds an all-in-one easy to install dockerfile

FROM       debian:bookworm
MAINTAINER ScopeBerry <genixpro@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt update && apt install curl -y

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash

# Install some basic system dependencies
RUN apt-get update && apt-get install \
    nginx \
    supervisor \
    nodejs -y
#    && \
#    rm -rf /var/lib/apt/lists/* && \
#        rm -rf /usr/share/doc/* && \
#        rm -rf /usr/share/icons/* && \
#        rm -rf /usr/share/man/*

# Set the working directory to /app
WORKDIR /scopeberry

# We add package.json first so that the  docker image build
# can use the cache as long as contents of package.json
# hasn't changed.
RUN mkdir /scopeberry/client
COPY client/package.json /scopeberry/client
WORKDIR /scopeberry/client
RUN npm install && \
        rm -rf /root/.npm/_cacache && \
        rm -rf /var/cache/*

ARG SCOPEBERRY_ENV

# Copy the NGINX configuration
ADD deployment/frontend/nginx_config /etc/nginx/sites-enabled/default
RUN sed "s/__SCOPEBERRY_ENV__/${SCOPEBERRY_ENV}/g" -i /etc/nginx/sites-enabled/default
#ADD deployment/ssl/scopeberry.key /etc/nginx/ssl/nginx.key
#ADD deployment/ssl/certbundle.pem /etc/nginx/ssl/nginx.pem

# Copy the current directory contents into the container at /scopeberry
ADD client /scopeberry/client

# Set the working directory to /scopeberry/client, and build the frontend package
WORKDIR /scopeberry/client
ENV SCOPEBERRY_ENV=${SCOPEBERRY_ENV}
ENV REVISION_ID=${REVISION_ID}

#RUN cp .env.${SCOPEBERRY_ENV} .env.chosen
#RUN rm .env.production
#RUN mv .env.chosen .env.production

# Build the frontend static files and delete all the scopeberry code, nodejs and python to trim down the image size
RUN npm run-script build && \
        mkdir /build && \
        mv build/* /build && \
        rm -rf /scopeberry && \
        apt-get purge nodejs -y && \
        rm -rf /root/.npm && \
        rm -rf /var/lib/dpkg/* && \
        rm -rf /usr/include/*

RUN mkdir -p /var/log/supervisord
COPY deployment/frontend/supervisord.conf /etc/supervisor/supervisord.conf

# Setup and configure systemd
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf", "-n"]
EXPOSE 80
EXPOSE 443
