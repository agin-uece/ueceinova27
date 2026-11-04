# syntax=docker/dockerfile:1

# ---------- deps ----------
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install

# ---------- dev: hot reload (codigo montado via volume) ----------
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- build: next build ----------
FROM deps AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY . .
RUN npm run build

# ---------- prod ----------
FROM node:20-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./
USER node
EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
