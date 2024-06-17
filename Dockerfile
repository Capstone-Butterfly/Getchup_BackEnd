FROM node:16

# Install PM2 globally
RUN npm install -g pm2

#Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force &&  npm install

COPY . .

EXPOSE 8080

#CMD [ "node", "app.js" ]