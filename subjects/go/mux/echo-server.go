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
	r := mux.NewRouter();
	r.Use(optic.Middleware)
	r.PathPrefix("/").HandlerFunc(EchoHandler)

	log.Fatal(http.ListenAndServe(":"+port, r))
}

func EchoHandler(writer http.ResponseWriter, request *http.Request) {
	statusOverrideString := request.Header.Get("return-status")
	statusOverride := int(200)
	if len(statusOverrideString) > 0 {
		parsed, err := strconv.ParseInt(statusOverrideString, 10, 32)
		if err == nil {
			statusOverride = int(parsed)
		}
	}

	writer.WriteHeader(statusOverride)
	for k, v := range request.Header {
		writer.Header()[k] = v
	}
	io.Copy(writer, request.Body)
}
