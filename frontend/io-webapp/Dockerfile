# build environment
FROM node:16-alpine3.11 as react-build
WORKDIR /app
COPY package*.json /app/
RUN npm install --silent
COPY ./ /app/
ARG REACT_APP_BACKEND_URL
RUN npm run build

# server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=react-build /app/build /usr/share/nginx/html
ENV PORT 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
