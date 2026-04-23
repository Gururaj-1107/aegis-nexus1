# Build Stage
FROM ubuntu:22.04 AS build

ENV DEBIAN_FRONTEND=noninteractive

# Install build tools
RUN apt-get update && apt-get install -y apt-utils \
    build-essential \
    cmake \
    git \
    libssl-dev \
    libboost-dev \
    libboost-system-dev \
    libboost-date-time-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Build the fast I/O C++ Matcher
RUN mkdir build && cd build && cmake .. && make

# Run Stage
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install basic open SSL lib for execution
RUN apt-get update && apt-get install -y apt-utils libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Copy the compiled binary from the build stage
COPY --from=build /app/build/matcher_service /app/matcher_service

# Expose the API port
EXPOSE 8080

CMD ["./matcher_service"]
