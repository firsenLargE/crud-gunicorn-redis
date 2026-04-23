FROM docker:latest

COPY docker-compose.yml /app/
WORKDIR /app

CMD ["docker-compose", "up"]
