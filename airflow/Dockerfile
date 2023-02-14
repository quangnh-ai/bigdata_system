ARG AIRFLOW_VERSION=2.5.1
ARG PYTHON_VERSION=3.10
ARG CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"

FROM python:${PYTHON_VERSION}-slim-buster

RUN apt-get update && apt-get upgrade -y
RUN pip install --upgrade pip

ARG CONSTRAINT_URL
ARG AIRFLOW_VERSION
RUN pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "${CONSTRAINT_URL}"


RUN mkdir /airflow
WORKDIR /airflow
RUN cd /airflow
RUN mkdir dags
RUN mkdir logs
RUN mkdir plugins
RUN chmod -R 777 /airflow

COPY airflow.cfg .
COPY requirements.txt .

RUN pip install -r requirements.txt

ENV AIRFLOW_HOME="/airflow"
ENV PYTHONPATH=$PYTHONPATH:"/"

CMD [ "sh", "-c", "airflow db init; airflow users create --firstname admin --lastname admin --email admin@admin.com --password 123456 --username admin --role Admin; airflow webserver & airflow scheduler" ]