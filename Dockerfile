FROM node:18.14.2 AS builder

RUN mkdir -p /app
WORKDIR /app

# 소스 코드 추가
ADD . .

# bcrypt 재설치
RUN npm uninstall bcrypt
RUN npm install bcrypt

# 패키지 설치 및 빌드
RUN npm install
RUN npm run build

# 환경 변수 설정
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# 명령어: TypeORM 마이그레이션 및 개발 서버 실행
CMD npm run typeorm migration:run && npm run start:dev
