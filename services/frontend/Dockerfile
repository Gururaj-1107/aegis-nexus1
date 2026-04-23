FROM node:20-alpine

WORKDIR /app

# Declare build args FIRST so cache busts when they change
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GEMINI_API_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY

# Install dependencies (cached unless package.json changes)
COPY package*.json ./
RUN npm install

# Copy ALL source files (this layer invalidates on any code change)
COPY . .

# Build Next.js app (bakes in NEXT_PUBLIC_* env vars)
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
