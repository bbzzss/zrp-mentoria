FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY index.js ./

COPY ./src ./src

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
