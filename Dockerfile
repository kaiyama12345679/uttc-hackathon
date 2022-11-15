FROM golang:1.18 as build


WORKDIR /app

COPY ./backend/go.mod ./
COPY ./backend/go.sum ./

COPY ./backend/main.go ./

RUN go mod download

RUN go build -o ./main

EXPOSE 8080

CMD ["./main"]