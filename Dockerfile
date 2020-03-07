ARG NODE_VERSION=10.19.0

# CLIENT
FROM node:${NODE_VERSION}-alpine AS client

WORKDIR /home/node

ADD --chown=node:node /client /home/node

USER node

RUN yarn install --frozen-lockfile --no-cache
RUN chmod +x ./node_modules/.bin/react-scripts
RUN yarn build
RUN rm -rf ./node_modules

# SERVER
FROM node:${NODE_VERSION}-alpine AS server

WORKDIR /home/node

ADD --chown=node:node /server /home/node

RUN yarn install --frozen-lockfile --no-cache --production

# APP
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app/client

COPY --from=client /home/node /home/node/app/client

WORKDIR /home/node/app/server

COPY --from=server /home/node /home/node/app/server
