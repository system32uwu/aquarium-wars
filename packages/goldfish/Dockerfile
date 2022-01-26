FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3000

ENV PORT 3000

CMD [ "yarn", "run", "dev" ]
