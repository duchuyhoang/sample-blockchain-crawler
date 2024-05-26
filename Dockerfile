FROM node:14 as builder
# LABEL
WORKDIR /crawler
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-slim
COPY --from=builder /crawler .
# RUN npm i -g pm2 
EXPOSE 3000
CMD ["npm","run","start:prod"]
