# syntax=docker/dockerfile:1

FROM node:20-alpine AS app

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3002

EXPOSE 3002

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then pnpm exec nuxt dev --host 0.0.0.0 --port ${PORT}; else node .output/server/index.mjs; fi"]
