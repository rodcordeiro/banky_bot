FROM node:23-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --ignore-scripts -g pnpm@9.15.0

WORKDIR /bot

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm run build

CMD [ "node","dist/src/index.js" ]
