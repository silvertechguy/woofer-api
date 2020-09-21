FROM postgres:12.3

ADD /utils/ /docker-entrypoint-initdb.d/utils/
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seed/ /docker-entrypoint-initdb.d/seed/
ADD /management/ /docker-entrypoint-initdb.d/management/
ADD /triggers/ /docker-entrypoint-initdb.d/triggers/

ADD deploy_schemas.sql /docker-entrypoint-initdb.d/
