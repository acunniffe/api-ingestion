package go_mux

import (
	"bufio"
	"bytes"
	"fmt"
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

		requestBytes, err := httputil.DumpRequest(r, true)

		responseRecorder := httptest.NewRecorder()

		next.ServeHTTP(responseRecorder, r)

		if err == nil {
			requestReader := bytes.NewReader(requestBytes)
			parsedReq, err := http.ReadRequest(bufio.NewReader(requestReader))
			if err == nil {
				logInteraction(parsedReq, responseRecorder.Result())
			}
		}

		for k, v := range responseRecorder.HeaderMap {
		    log.Print(k)
			w.Header()[k] = v
		}
		w.WriteHeader(responseRecorder.Code)
		_, _ = responseRecorder.Result().Body.WriteTo(w)
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
