#########
# BUILD
#########
FROM --platform=linux/amd64 node:18.19.1-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY esbuild.config.js ./
COPY src ./src

RUN yarn tsc --noEmit \
  && node esbuild.config.js \
  && npx pkg -t node18-alpine-x64 --out-path dist-binary ./dist/index.js

#########
# DEPLOY
#########
FROM --platform=linux/amd64 alpine:3.20.0 AS deploy

WORKDIR /app

RUN apk add bash

COPY swagger-ui-dist ./swagger-ui-dist
COPY --from=build ./app/dist-binary ./dist-binary

CMD ["/bin/bash", "-c", "./dist-binary/index"]
