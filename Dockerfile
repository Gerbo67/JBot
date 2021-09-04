FROM node:16
FROM keymetrics/pm2:latest-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "pm2-runtime", "start", "src/index.js" ]