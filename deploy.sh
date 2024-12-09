git pull;
npx prisma migrate dev;
kill -9 `ps -aux | grep ts-node`;
/usr/bin/nohup bash -c '{ ts-node ~/app/sanctions-back/src/index.ts ;}' &;