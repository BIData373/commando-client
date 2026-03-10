FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx msw init public/ --save

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
