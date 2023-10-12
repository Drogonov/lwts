# Add source to node
FROM node:alpine

# if you have different dir then root on folder you should add it here
WORKDIR /lwts-app

# i am not sure that this lines works properly becouse they do same actions as COPY do i guess
ADD package*.json ./
ADD server.js ./

# copying all files to our new workdir
COPY . . 

# installing node packages
RUN npm install

# now starts boilerplate code that installs openssl, dockerize and setups them
RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# dockerize will wait port 3306 till it will start working and when it starts we will start our app
CMD dockerize -wait tcp://db:3306 -timeout 60m yarn start