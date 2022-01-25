FROM node:lts-alpine AS deps

RUN apk add --no-cache libc6-compat

# Rebuild the source code only when needed
FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile

# COPY /usr/src/app/node_modules ./node_modules

RUN yarn salmon hardhat
RUN yarn salmon hardhat compile

# runner
FROM node:lts-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV production

# unprivileged user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S poseidon -u 1001 

COPY --from=builder /usr/src/app/packages /usr/src/app/packages

COPY --from=builder --chown=poseidon:nodejs /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder --chown=poseidon:nodejs /usr/src/app/yarn.lock /usr/src/app/yarn.lock

USER poseidon

EXPOSE 3000
EXPOSE 8545

CMD [ "yarn salmon hardhat node & yarn goldfish dev" ]

# dev stage
# FROM node:lts as dev-stage

# WORKDIR /usr/src/app

# COPY package.json ./
# COPY yarn.lock ./

# RUN yarn

# COPY . .

# RUN yarn salmon hardhat

# RUN yarn salmon hardhat compile

# EXPOSE 8545
# EXPOSE 3000

# CMD hardhat node & yarn goldfish dev

# CMD yarn salmon hardhat node

# production stage

# FROM node:lts as production-stage

# WORKDIR /usr/src/app

# COPY package.json ./
# COPY yarn.lock ./

# COPY packages/goldfish ./packages/goldfish

# COPY packages/salmon ./packages/salmon
# COPY packages/salmon/.env ./packages/salmon/.env

# COPY packages/shark ./packages/shark
# COPY packages/shark/.env ./packages/shark/.env

# COPY packages/whale ./packages/whale 
# COPY packages/whale/.env ./packages/whale/.env 

# RUN yarn install --pure-lockfile --non-interactive --production

# # allows next, hardhat and other packages to be invoked

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# # --- SALMON

# # register hardhat tasks
# RUN yarn salmon hardhat

# # compile smart contracts
# RUN yarn salmon hardhat compile

# # --- SALMON

# # --- SHARK -> Shark is a CLI utility, should only be used via terminal. In the future GUI might be built with it. # --- SHARK

# # --- WHALE

# # build prisma and types
# # RUN yarn whale build

# # --- WHALE

# # --- GOLDFISH

# # build next app
# RUN yarn goldfish build

# # --- GOLDFISH

# # start local ethereum node and start next app

# EXPOSE 8545
# EXPOSE 3000

# CMD yarn salmon hardhat node && yarn goldfish dev
