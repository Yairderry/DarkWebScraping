FROM node:14

RUN apt-get update && apt-get install -y openjdk-8-jdk

WORKDIR /scraper

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]