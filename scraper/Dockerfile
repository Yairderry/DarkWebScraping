FROM node:latest

RUN apt-get -y install default-jre

WORKDIR /scraper

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]