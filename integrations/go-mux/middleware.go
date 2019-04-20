package go_mux

import (
	"bufio"
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !shouldLogRequest(r) {
			next.ServeHTTP(w, r)
			return
		}
		log.Print("using optic")
		log.Print(r)
		responseWriter := httptest.NewRecorder()
		next.ServeHTTP(responseWriter, r)

		response := responseWriter.Result()
		responseBody, responseReadErr := ioutil.ReadAll(response.Body)

		log.Print(response.StatusCode)
		log.Print(string(responseBody))

		w.WriteHeader(response.StatusCode)
		for k, v := range response.Header {
			log.Print(k)
			log.Print(v)
			w.Header()[k] = v
		}
		log.Print(responseReadErr)
		if responseReadErr == nil {
			_, _ = w.Write(responseBody)
		}

		requestBytes, err := httputil.DumpRequest(r, true)
		if err == nil {
			requestReader := bytes.NewReader(requestBytes)

			_, err := http.ReadRequest(bufio.NewReader(requestReader))
			if err == nil {
				//logInteraction(parsedReq, response)
			}
		}
	})
}

func isWsHandshakeRequest(req *http.Request) bool {
	if strings.ToLower(req.Header.Get("Upgrade")) == "websocket" {
		parts := strings.Split(strings.ToLower(req.Header.Get("Connection")), ",")
		for _, part := range parts {
			if strings.TrimSpace(part) == "upgrade" {
				return true
			}
		}
	}
	return false
}

func shouldLogRequest(req *http.Request) bool {
	shouldUseOptic := len(os.Getenv("OPTIC_SERVER_LISTENING")) > 0
	if !shouldUseOptic {
		return false
	}
	if isWsHandshakeRequest(req) {
		return false
	}

	return true
}

func logInteraction(req *http.Request, res *http.Response) {
	host := os.Getenv("OPTIC_SERVER_HOST")
	requestUrl := req.URL
	requestUrl.Scheme = "http"
	requestUrl.Host = host + ":30334"

	requestCopy := &http.Request{
		URL:    requestUrl,
		Method: req.Method,
		Body:   req.Body,
		Header: req.Header,
	}
	requestCopy.URL = requestUrl
	client := http.DefaultClient

	interaction, err := client.Do(requestCopy)
	if err == nil {

		buffer := new(bytes.Buffer)
		_, _ = buffer.ReadFrom(interaction.Body)

		interactionId := buffer.String()
		path := fmt.Sprintf("/interactions/%s/status/%d", interactionId, res.StatusCode)

		responseUrl := &url.URL{
			Scheme: "http",
			Host:   host + ":30335",
			Path:   path,
		}

		responseLog := &http.Request{
			Method: "POST",
			Body:   res.Body,
			Header: res.Header,
			URL:    responseUrl,
		}
		_, _ = client.Do(responseLog)
	} else {
		log.Print("optic error")
		log.Print(fmt.Sprint(err))
	}
}
