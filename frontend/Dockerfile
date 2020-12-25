FROM node:12.18.4-alpine

# Create app directory
WORKDIR /usr/src/location-search/frontend

# Install app dependencies
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "npm", "start" ]