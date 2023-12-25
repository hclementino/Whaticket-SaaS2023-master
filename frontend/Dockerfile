FROM node:18.17.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV NODE_OPTIONS="--openssl-legacy-provider"

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
