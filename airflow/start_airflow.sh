if [ "$AIRFLOW_MODE" = "master" ]; then
    airflow db init
    airflow users create --firstname $AIRFLOW_FIRSTNAME --lastname $AIRFLOW_LASTNAME --email $AIRFLOW_EMAIL --password $AIRFLOW_PASSWORD --username $AIRFLOW_USERNAME --role $AIRFLOW_ROLE
    airflow webserver & airflow scheduler

elif [ "$AIRFLOW_MODE" = "worker" ]; then
    airflow celery worker

elif [ "$AIRFLOW_MODE" = "monitor" ]; then
    airflow celery flower
fi