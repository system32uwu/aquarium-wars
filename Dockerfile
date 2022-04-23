FROM node:lts
ENV APP_ROOT /app

WORKDIR ${APP_ROOT}

COPY package.json .
COPY yarn.lock .

# generative art tool

COPY ./packages/shark ${APP_ROOT}/packages/shark

# db

COPY ./packages/whale ${APP_ROOT}/packages/whale

# contracts

COPY ./packages/salmon ${APP_ROOT}/packages/salmon

# client

COPY ./packages/goldfish ${APP_ROOT}/packages/goldfish

EXPOSE 3000
EXPOSE 8545
EXPOSE 5432

RUN yarn install