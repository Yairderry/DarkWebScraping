FROM node

WORKDIR /backend

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 8090

CMD ["npm", "start"]