FROM node:19

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start"]