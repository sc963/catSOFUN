FROM mhart/alpine-node:10.16 AS builder

ARG HOST_NAME
ARG PORT
ARG MONGODB_URI

RUN apk --update --no-cache --virtual dev-dependencies add \
  git python make g++ build-base
WORKDIR /var/www/app
COPY . ./
RUN npm config set unsafe-perm true \
  && npx browserslist@latest --update-db \
  && yarn \
  && yarn build --release


FROM mhart/alpine-node:10.16
WORKDIR /var/www/app
COPY --from=builder /var/www/app/build build
COPY --from=builder /var/www/app/node_modules node_modules

EXPOSE 3000
CMD ["node", "build/server.js"]
