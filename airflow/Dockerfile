ARG AIRFLOW_VERSION=2.5.1
ARG PYTHON_VERSION=3.10
ARG CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"

FROM python_jdk:python-3.10.6-jdk-11.10.16

RUN apt-get update && apt-get upgrade -y
RUN pip install --upgrade pip

ARG CONSTRAINT_URL
ARG AIRFLOW_VERSION
RUN pip install "apache-airflow[celery]==${AIRFLOW_VERSION}" --constraint "${CONSTRAINT_URL}"


RUN mkdir /airflow
WORKDIR /airflow
RUN cd /airflow
RUN mkdir dags
RUN mkdir logs
RUN mkdir plugins
RUN chmod -R 777 /airflow

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY start_airflow.sh .

ENV AIRFLOW_HOME="/airflow"
ENV PYTHONPATH=$PYTHONPATH:"/"
ENV AIRFLOW_FIRSTNAME="admin"
ENV AIRFLOW_LASTNAME="admin"
ENV AIRFLOW_EMAIL="admin@admin.com"
ENV AIRFLOW_PASSWORD="admin"
ENV AIRFLOW_USERNAME="admin"
ENV AIRFLOW_ROLE="Admin"

CMD [ "bash", "start_airflow.sh"]