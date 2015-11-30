FROM node:4.2

RUN apt-get update \
  && apt-get install -y \
    libcairo2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/game
COPY . /usr/src/game

RUN npm install \
  && npm run build \
  && rm -rf node_modules \
  && npm install --production

WORKDIR /usr/src/game

CMD [ "npm", "run", "production" ]
