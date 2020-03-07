FROM node:10.19.0-alpine

USER node

# CLIENT
RUN mkdir /usr/src/app/client

WORKDIR /usr/src/app/client

COPY /client/package.json /client/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache

COPY /client ./

# RUN yarn lint
RUN yarn build
RUN rm -rf ./node_modules

# SERVER
RUN mkdir /usr/src/app/server

WORKDIR /usr/src/app/server

COPY /server/package.json /server/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache --production

COPY /server ./
