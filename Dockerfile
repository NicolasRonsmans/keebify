FROM node:10.19.0-alpine

USER node

ENV NPM_CONFIG_PREFIX=~/.npm-global

RUN mkdir ~/.npm-global && mkdir ~/app && mkdir ~/app/client && mkdir ~/app/server

# CLIENT
WORKDIR /home/node/app/client

COPY /client/package.json /client/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache

COPY /client ./

RUN sudo chmod -R 777 ./

# RUN yarn lint
RUN yarn build
RUN rm -rf ./node_modules

# SERVER
WORKDIR /home/node/app/server

COPY /server/package.json /server/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache --production

COPY /server ./
