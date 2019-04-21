package go_mux

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
)

type teeCloser struct {
	tee    io.Reader
	source io.Closer
}

func (tc *teeCloser) Read(p []byte) (n int, err error) {
	return tc.tee.Read(p)
}

func (tc *teeCloser) Close() error {
	_ = tc.source.Close()
	return nil
}

func WrapReader(source io.ReadCloser) (firstReader io.ReadCloser, secondReader io.ReadCloser) {
	var buffer bytes.Buffer
	copyReader := ioutil.NopCloser(&buffer)
	tee := io.TeeReader(source, &buffer)
	tc := &teeCloser{tee, source}

	return tc, copyReader
}

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !shouldLogRequest(r) {
			next.ServeHTTP(w, r)
			return
		}
		log.Print("optic: before")
		log.Print(r)

		requestBody, requestBodyCopyReader := WrapReader(r.Body)
		requestCopy := r
		requestCopy.Body = requestBody
		responseRecorder := httptest.NewRecorder()

		next.ServeHTTP(responseRecorder, requestCopy)

		log.Print("optic: after")
		response := responseRecorder.Result()
		responseBody, responseBodyCopyReader := WrapReader(response.Body)
		response.Body = responseBody
		log.Print("optic: before replaying response")
		WriteResponse(response, w)
		log.Print("optic: after replaying response")

		log.Print("optic: before logging request and response")
		logInteraction(requestCopy, requestBodyCopyReader, response, responseBodyCopyReader)
		log.Print("optic: after logging request and response")
	})
}

func WriteResponse(response *http.Response, w http.ResponseWriter) {
	log.Printf("optic: writing response (%d)", response.StatusCode)

	for k, v := range response.Header {
		log.Print(k)
		log.Print(v)
		w.Header()[k] = v
	}

	w.WriteHeader(response.StatusCode)
	bytesWritten, err := io.Copy(w, response.Body)
	if err != nil {
		log.Print(err)
		return
	}
	log.Printf("body: %d bytes written", bytesWritten)
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

func logInteraction(req *http.Request, requestBody io.ReadCloser, res *http.Response, responseBody io.ReadCloser) {
	interactionId, err := logRequest(req, requestBody)
	if err == nil {
		err := logResponse(interactionId, res, responseBody)
		if err != nil {
			log.Print("optic error logging response")
			log.Print(fmt.Sprint(err))
		}
	} else {
		log.Print("optic error logging request")
		log.Print(fmt.Sprint(err))
	}
}

func logResponse(interactionId string, res *http.Response, responseBody io.ReadCloser) (err error) {
	host := os.Getenv("OPTIC_SERVER_HOST")
	client := http.DefaultClient

	path := fmt.Sprintf("/interactions/%s/status/%d", interactionId, res.StatusCode)

	responseUrl := &url.URL{
		Scheme: "http",
		Host:   host + ":30335",
		Path:   path,
	}

	responseLog := &http.Request{
		Method: "POST",
		Body:   responseBody,
		Header: res.Header,
		URL:    responseUrl,
	}

	log.Print("updated request for logging response")
	log.Print(res.Header)

	_, err = client.Do(responseLog)
	return err;
}

func logRequest(req *http.Request, requestBody io.ReadCloser) (interactionId string, err error) {
	host := os.Getenv("OPTIC_SERVER_HOST")
	client := http.DefaultClient

	requestUrl := req.URL
	requestUrl.Scheme = "http"
	requestUrl.Host = host + ":30334"

	logRequestRequest := &http.Request{
		URL:    requestUrl,
		Method: req.Method,
		Body:   requestBody,
		Header: req.Header,
	}
	logRequestRequest.URL = requestUrl
	log.Print("updated request for logging request")
	log.Print(logRequestRequest)
	interactionResponse, err := client.Do(logRequestRequest)
	if err == nil {
		buffer := new(bytes.Buffer)
		_, _ = buffer.ReadFrom(interactionResponse.Body)

		interactionId := buffer.String()
		log.Printf("interactionID %s", interactionId)
		return interactionId, nil
	}
	return "", err
}
