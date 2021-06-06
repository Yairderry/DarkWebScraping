FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=80

EXPOSE 80

CMD ["npm", "start"]