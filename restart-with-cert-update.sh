kill -9 `ps -aux | grep ts-node`;
certbot renew;
/usr/bin/nohup bash -c '{ ts-node ~/app/sanctions-back/src/index.ts ;}' &