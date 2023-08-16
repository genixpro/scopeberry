# This builds an all-in-one easy to install dockerfile

FROM ubuntu:22.04
MAINTAINER PlanGuru <genixpro@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install gnupg2 gnupg1 gnupg curl -y

# Install some basic system dependencies
RUN apt-get update && apt-get install \
    build-essential \
    g++ \
    gcc \
    gfortran \
    git \
    python3 \
    python3-dev \
    python3-pip \
    python3-setuptools \
    python3-tk \
    python3-venv \
    python3-cffi \
    sudo \
    unzip \
    vim \
    wget \
     -y && \
    rm -rf /var/lib/apt/lists/*

# Create the planguru user
RUN useradd -s /bin/bash --home-dir /home/planguru planguru && \
    mkdir /home/planguru && \
    chown -R planguru:planguru /home/planguru

# Set the working directory to /app
WORKDIR /planguru
COPY server/requirements.txt .

# Install some dependencies which can take a long time to install. We do this ahead of running "ADD . /planguru" so the builds run faster when your
# making code changes regularly
RUN pip3 install --upgrade pip==20.2.4 && \
    pip3 install --upgrade setuptools && \
    pip3 install --upgrade cryptography && \
    pip3 install -r requirements.txt && \
    chmod +r+r+r -R /usr/lib/python3/ && \
    rm -rf /root/.cache

# Remove stuff that is no longer needed after all this installation
RUN apt purge -y \
         vim \
         gcc \
         python3-dev && \
    rm -rf /var/log/* && \
    rm -rf /usr/share/icons/* && \
    rm -rf /usr/share/doc/* && \
    rm -rf /usr/share/man/* && \
    rm -rf /var/cache/* && \
    rm -rf /var/lib/dpkg/*

# Set the working directory to /app
WORKDIR /planguru

# Copy the current directory contents into the container at /planguru
ADD server /planguru/server

# Install dependencies for server
WORKDIR /planguru/server
RUN python3 setup.py install && \
    rm -rf /root/.cache && \
    chmod +r+r+r -R /usr/lib/python3/

ARG PLANGURU_ENV
ARG REVISION_ID
ENV PLANGURU_ENV=${PLANGURU_ENV}
ENV REVISION_ID=${REVISION_ID}


ENV HOME=/home/planguru
RUN chown -R planguru:planguru /planguru && \
    chown -R planguru:planguru /home/planguru && \
    chmod ugo+r -R /usr/lib/python3

RUN rm -rf /usr/include/*

WORKDIR /home/planguru
RUN chmod ugo+r -R /usr/lib/python3 && chown -R planguru:planguru /home/planguru
WORKDIR /planguru/server

# Output all the disk usage for various folders on the system.
# This helps us to further optimize the container
# RUN du -h -d 5 -t 10M /; exit 0

USER planguru:planguru

# Setup and configure systemd
ENTRYPOINT ["bash", "-c", "gunicorn -t 600 -w 1 -b 0.0.0.0:3000 planguru.app:app"]

EXPOSE 3000
