# BIG DATA SYSTEM

This repo is updated constantly :D

## Build base docker image
```bash
cd base_image
docker build -t python_jdk:python-3.10.6-jdk-11.10.16
```

## Build spark docker image
```bash
cd spark
docker build -t spark:spark-3.3.1-hadoop-3
```

## Build jupyterlab docker image
```bash
cd jupyterlab
docker build -t jupyterlab:python-3.10.6-jdk-11.10.16
```

## Start the service
```bash
docker-compose up
```
| Service               | URL                              | Password    | Username       |
| :-------------------: | :------------------------------: | :---------: | :------------: |
| Jupyterlab            | http://localhost:8888            | admin123    |                |
| Spark App UI          | http://localhost:4040            |             |                |
| Spark Master UI       | http://localhost:9090            |             |                |
| Spark Worker 1 UI     | http://localhost:9091            |             |                |
| Spark Worker 2 UI     | http://localhost:9092            |             |                |
| pgadmin               | http://localhost:5051            | admin       | admin@admin.com|
