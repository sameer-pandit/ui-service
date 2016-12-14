FROM mhart/alpine-node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#ENV HTTP_PROXY http://www-proxy.idc.oracle.com:80/
#ENV HTTPS_PROXY http://www-proxy.idc.oracle.com:80/
#ENV http_proxy http://www-proxy.idc.oracle.com:80/
#ENV https_proxy http://www-proxy.idc.oracle.com:80/
# Install app dependencies
COPY package.json /usr/src/app/
RUN npm config set proxy http://www-proxy.idc.oracle.com:80/
RUN npm config set https-proxy http://www-proxy.idc.oracle.com:80/
RUN npm config set registry http://registry.npmjs.org/
RUN npm install --verbose

# Bundle app source
COPY . /usr/src/app
#COPY capService.js /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
