FROM node:4.2

RUN apt-get update \
  && apt-get install -y \
    libcairo2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/game
COPY package.json /usr/src/game
WORKDIR /usr/src/game

COPY ext /usr/src/game/ext
COPY server /usr/src/game/server
COPY services /usr/src/game/services
COPY shared /usr/src/game/shared
COPY test /usr/src/game/test
COPY index.js /usr/src/game

# RUN npm install --production

CMD [ "npm", "start" ]
