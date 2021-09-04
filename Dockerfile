FROM node:16

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install pm2 -g

COPY . .

EXPOSE 3000

CMD [ "pm2", "start", "src/index.js" ]