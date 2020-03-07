FROM node:10.19.0-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

USER node

RUN mkdir /home/node/.npm-global && mkdir /home/node/app && mkdir /home/node/app/client && mkdir /home/node/app/server

# CLIENT
WORKDIR /home/node/app/client

COPY /client/package.json /client/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache

COPY /client ./

# RUN yarn lint
RUN chmod +x ./node_modules/.bin/react-scripts
RUN yarn build
RUN rm -rf ./node_modules

# SERVER
WORKDIR /home/node/app/server

COPY /server/package.json /server/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache --production

COPY /server ./
