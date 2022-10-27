# Define base image for jdk and python version
# You can use base image is python and install jdk instead, it's pretty easier than like this.
# I just want to make everythings become complicated to practice how to write a Dockerfile XD.
# P/S: Notice at line 41 and 42, remember change the command which python3.10, which pip3.10 with the corresponding python version you want to use to creat the docker image
#      In this Dockerfile, i used python3.10.6 to create the image so that those commands are python3.10 annd pip3.10
#      If you want to use 3.9.x, those commands will be python3.9 and pip3.9 similar to the others python version.
ARG JDK_VERSION=11.0.16-jre-slim-buster
ARG PYTHON_VERSION=3.10.6

# pull base image
FROM openjdk:$JDK_VERSION

# update apt and requirement tools
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y wget \
                       curl \
                       nano \ 
                       procps \
                       build-essential \
                       libreadline-gplv2-dev \
                       libncursesw5-dev \
                       libssl-dev \
                       libsqlite3-dev \
                       tk-dev \
                       libgdbm-dev \
                       libc6-dev \
                       libbz2-dev \
                       libffi-dev \
                       zlib1g-dev

# Download python
RUN cd /usr/src

ARG PYTHON_VERSION
RUN wget https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tgz && \
    tar xzf Python-${PYTHON_VERSION}.tgz && \
    cd Python-${PYTHON_VERSION} && \
    ./configure --enable-optimizations && \
    make altinstall

# Setup python3.10 as python3, pip3.10 as pip3 default command and remove downloaded tgz file
RUN cd / && \
    rm -rf Python-$PYTHON_VERSION.tgz && \
    update-alternatives --install /usr/bin/python python $(which python3.10) 1 && \
    update-alternatives --install /usr/bin/pip pip $(which pip3.10) 1 && \
    pip install --upgrade pip