# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn prisma generate
RUN yarn run build

# Stage 2: Setup the runtime image
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app ./

RUN yarn install --only=prod
RUN yarn prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD yarn migrate:docker && yarn start:prod
