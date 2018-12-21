FROM node:10
WORKDIR /urs/src/app
COPY package*.json ./
RUN npm install
COPY app.js jest.config.js run.sh ./
COPY bin ./bin
COPY config ./config
COPY controllers ./controllers
COPY models ./models
COPY public ./public
COPY routes ./routes
COPY tests ./tests
COPY views ./views
EXPOSE 8080
# normal start
# CMD ["npm", "start"]
# custom start script
CMD ./run.sh
