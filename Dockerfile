FROM node:10.19.0-alpine

WORKDIR /usr/src/app


USER node

# CLIENT
WORKDIR /usr/src/app/client

RUN chown -R node:node ./

COPY /client/package.json /client/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache

COPY /client ./

# RUN yarn lint
RUN yarn build
RUN rm -rf ./node_modules

# SERVER
WORKDIR /usr/src/app/server

RUN chown -R node:node ./

COPY /server/package.json /server/yarn.lock ./

RUN yarn --frozen-lockfile --no-cache --production

COPY /server ./
