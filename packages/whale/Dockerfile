FROM node:lts

ENV APP_ROOT /app

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN yarn install

CMD [ "yarn run prisma generate && yarn run build && yarn run prisma migrate --dev init" ]