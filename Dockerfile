FROM node:16.17.1

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3005

CMD ["node", "./server.js"]