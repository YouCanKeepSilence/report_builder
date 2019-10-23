FROM alpine:3.7 AS base
RUN apk add --no-cache nginx nodejs tini

WORKDIR /root/report_builder
ENTRYPOINT ["/sbin/tini", "--"]

COPY proxy-backend ./proxy-backend
COPY frontend ./frontend
COPY nginx.conf ./nginx.conf

# mute npm progress, building backend && frontend
RUN npm set progress=false && npm config set depth 0 && cd proxy-backend && npm install && npm run build && cd ../frontend && npm install && npm run build_prod && rm -rf node_modules

# configurating nginx
RUN adduser -D -g 'www' www && mkdir /www && chown -R www:www /var/lib/nginx && chown -R www:www /www && mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig && mv ./nginx.conf /etc/nginx/nginx.conf && cd frontend/dist && cp -Rf . /www && mkdir -p /run/nginx 

EXPOSE 80
EXPOSE 3000
CMD nginx && node proxy-backend/dist/main.js
