FROM node:lts
ENV APP_ROOT /app

WORKDIR ${APP_ROOT}

COPY package.json .
COPY yarn.lock .

# salmon

COPY ./packages/salmon ${APP_ROOT}/packages/salmon

EXPOSE 8545

#goldfish

COPY ./packages/goldfish ${APP_ROOT}/packages/goldfish

EXPOSE 3000

ENV PORT 3000



RUN yarn install

CMD ["bash -c", "yarn salmon dev & yarn goldfish dev"] 