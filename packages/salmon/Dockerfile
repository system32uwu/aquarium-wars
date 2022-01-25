FROM node:lts

ENV APP_ROOT /app

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN yarn install

EXPOSE 8545

CMD [ "yarn", "dev" ]