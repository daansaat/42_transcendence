FROM node:19

# Set the working directory to /app
WORKDIR /app


# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]