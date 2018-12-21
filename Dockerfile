FROM node:8
WORKDIR /urs/src/app
COPY package*.json ./
RUN npm install
COPY app.js run.sh ./
COPY bin ./bin
COPY config ./config
COPY controllers ./controllers
COPY models ./models
COPY public ./public
COPY routes ./routes
COPY views ./views
EXPOSE 8080
# normal start
# CMD ["npm", "start"]
# custom start script
CMD ./run.sh
