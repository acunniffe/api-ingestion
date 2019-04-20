package main

import (
	"github.com/gorilla/mux"
	optic "github.com/opticdev/api-ingestion/integrations/go-mux"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
)

func main() {
	port := os.Getenv("OPTIC_SERVER_PORT")
	log.Print(port)
	r := mux.NewRouter();
	r.Use(optic.Middleware)
	r.PathPrefix("/").HandlerFunc(EchoHandler)

	log.Fatal(http.ListenAndServe(":"+port, r))
}

func EchoHandler(writer http.ResponseWriter, request *http.Request) {
	log.Print("echo handler before")
	statusOverrideString := request.Header.Get("return-status")
	statusOverride := int(200)
	if len(statusOverrideString) > 0 {
		parsed, err := strconv.ParseInt(statusOverrideString, 10, 32)
		if err == nil {
			statusOverride = int(parsed)
		}
	}

	log.Print("copying request headers")
	for k, v := range request.Header {
		log.Print(k)
		log.Print(v)
		writer.Header()[k] = v
	}
	log.Print("copying request body")
	_, err := io.Copy(writer, request.Body)
	if err != nil {
		log.Print(err)
	}
	writer.WriteHeader(statusOverride)
	log.Print("echo handler after")
}
