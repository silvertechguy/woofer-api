FROM node:12.18
RUN mkdir -p /usr/src/woofer-api
WORKDIR /usr/src/woofer-api
COPY package.json package-lock.json ./
RUN npm install
COPY . .