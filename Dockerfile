FROM node:16

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

FROM ubuntu:trusty
ENV LANG en_US.UTF-8
CMD ["/bin/bash"]

EXPOSE 3000

CMD [ "npm", "start"]
