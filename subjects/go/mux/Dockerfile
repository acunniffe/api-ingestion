FROM golang:1.8
WORKDIR /go/src/app
COPY . .
ENV OPTIC_SERVER_LISTENING=yes
ENV OPTIC_SERVER_HOST=testhost
ENV OPTIC_SERVER_PORT=4000
RUN ["go","get", "-v"]
CMD ["go", "run", "echo-server.go"]