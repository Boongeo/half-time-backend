FROM node:18.14.2 AS builder

RUN mkdir -p /app
WORKDIR /app

# 소스 코드 추가
ADD . .

RUN npm uninstall bcrypt
RUN npm install bcrypt

RUN npm install
RUN npm run build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY .env.production /app/.env

CMD npm run typeorm migration:run && npm run start:prod
