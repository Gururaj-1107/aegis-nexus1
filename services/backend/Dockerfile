FROM node:20-slim

# Prisma requires OpenSSL on slim images
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

ARG GOOGLE_CLOUD_PROJECT=aegis-nexus
ENV GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT}

EXPOSE 8080

CMD ["npm", "start"]
