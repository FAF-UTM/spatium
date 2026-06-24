# syntax=docker/dockerfile:1

# ---- Build the static site ----------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first for better layer caching.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# The API base URL is baked into the bundle at build time (Vite). Pass it as a
# build arg: --build-arg VITE_API_URL=https://your-backend.code.run
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN yarn build

# ---- Serve with nginx ---------------------------------------------------
FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
