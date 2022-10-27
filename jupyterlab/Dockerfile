FROM python_jdk:python-3.10.6-jdk-11.10.16

RUN apt-get update && apt-get upgrade -y
RUN apt-get -y install ffmpeg \
                       libsm6 \
                       libxext6 \
                       git \
                       make \
                       bash-completion \
                       sudo
RUN apt-get -y autoclean && \
    apt-get -y autoremove

RUN pip install --upgrade setuptools \
                          wheel
RUN pip install --no-cache-dir numpy \
                               jupyterlab \
                               pandas \
                               opencv-python \
                               matplotlib \
                               pyspark \
                               findspark

# RUN wget https://dlcdn.apache.org/hadoop/common/hadoop-3.3.4/hadoop-3.3.4.tar.gz && \
#     wget https://downloads.apache.org/hadoop/common/hadoop-3.3.4/hadoop-3.3.4.tar.gz.sha512 && \
#     shasum -a 512 hadoop-3.3.4.tar.gz && \
#     tar -xzvf hadoop-3.3.4.tar.gz && \
#     mv hadoop-3.3.4 /usr/local/hadoop && \
#     echo "export JAVA_HOME = $JAVA_HOME" >> /usr/local/hadoop/etc/hadoop/hadoop-env.sh


WORKDIR /opt/jupyterlab

CMD ["jupyter", "lab", "--ip=0.0.0.0", "--allow-root"]