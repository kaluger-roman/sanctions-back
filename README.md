sudo -u psql postgres;
\c sanctions;
CREATE EXTENSION pg_trgm;

nohup bash -c '{ ts-node ./src/index.ts ;}' &
