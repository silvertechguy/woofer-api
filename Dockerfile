FROM node:12.18-slim
RUN mkdir -p /srv/woofer-api && chown node:node /srv/woofer-api
WORKDIR /srv/woofer-api
USER node
COPY --chown=node:node package*.json yarn.lock* ./
RUN npm install --quiet && npm cache clean --force
COPY --chown=node:node . .