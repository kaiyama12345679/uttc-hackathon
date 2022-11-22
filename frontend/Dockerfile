FROM node:16-alpine

WORKDIR /code

ADD ./package.json ./package-lock.json /code/
RUN npm install --legacy-peer-deps
ADD ./ ./code/