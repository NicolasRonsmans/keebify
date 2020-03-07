ARG NODE_VERSION=10.19.0

# CLIENT
FROM node:${NODE_VERSION}-alpine AS client

WORKDIR /home/node

ADD /client /home/node

RUN ls -al

RUN yarn install --frozen-lockfile --no-cache && yarn build

FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app/client

COPY --from=client /home/node /home/node/app/client

# SERVER
FROM node:${NODE_VERSION}-alpine AS server

WORKDIR /home/node

ADD /server /home/node

RUN yarn install --frozen-lockfile --no-cache --production

FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app/server

COPY --from=server /home/node /home/node/app/server
