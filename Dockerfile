FROM node:16

#Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force &&  npm install

COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]