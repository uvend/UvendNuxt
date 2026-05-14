# syntax=docker/dockerfile:1

FROM node:20-alpine AS app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3002

EXPOSE 3002

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npx nuxt dev --host 0.0.0.0 --port ${PORT}; else node .output/server/index.mjs; fi"]
