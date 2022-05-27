FROM node:15-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
 
FROM node:15-alpine
WORKDIR /app
COPY --from=0 /app/ .
COPY ./ .
RUN npm run build
 
FROM nginx:1.19
RUN mkdir /app
#/app/assets/favicon.17e50649.svg   1.49 KiB
#/app/assets/logo.ecc203fb.svg      2.61 KiB
#/app/index.html                    0.46 KiB
#/app/assets/index.62f502b0.css     0.75 KiB / gzip: 0.48 KiB
#/app/assets/index.c001e6f3.js      148.26 KiB / gzip: 48.02 KiB
COPY --from=1 /app/dist /app
COPY ./nginx.conf /etc/nginx/nginx.conf