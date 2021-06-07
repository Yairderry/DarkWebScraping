FROM node:12

WORKDIR /backend

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 80

CMD ["npm", "start"]