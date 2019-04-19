# Using Optic with Go + Mux
Integrating Optic if you are using Mux with Go is as easy as using the Optic Middleware via Mux's `Router.Use(Middleware)` functionality.

```go
package main

import (
	"github.com/gorilla/mux"
	optic "github.com/opticdev/api-ingestion/integrations/go-mux"
	"log"
	"net/http"
	"os"
)

func main() {
	r := mux.NewRouter();
	r.Use(optic.Middleware)
	r.PathPrefix("/").HandlerFunc(<YourHandler>)

	log.Fatal(http.ListenAndServe(":8080", r))
}
```
