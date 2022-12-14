FROM golang:1.19 as build


WORKDIR /app

COPY ./backend/go.mod ./
COPY ./backend/go.sum ./

COPY ./backend/ ./

RUN go mod download

RUN go build -o ./main

EXPOSE 8080

CMD ["./main"]