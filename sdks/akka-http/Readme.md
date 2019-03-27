# Using Optic with Akka HTTP

Akka HTTP projects are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Akka HTTP API so that your integration tests document your code as they execute.

## Installation

Include the following dependency in your `build.sbt` file:

```scala
libraryDependencies += "com.useoptic" %% "document-akka-http" % "0.2.0"
```


## Using the Proxy Fixture
The `OpticFixture` is designed to work seamlessly with the Route TestKit DSL. Just wrap the `Route` instances you want included in your documentation like this:  

```scala
import com.useoptic.akka_http.scaladsl.Document.withOptic

it("/hello responds with 'World!'") {
    Get("/hello") ~> withOptic(helloRoute) ~> check {
      assert(responseAs[String] ==  "World!")
    }
}
```

The Optic enabled `Route` returned by `withOptic` can be reused as many times as you'd like. Here's an example of typical pattern for injecting Optic into your existing tests. 
```scala
import com.useoptic.akka_http.scaladsl.Document.withOptic

val documentedHelloRoute = withOptic(helloRoute)

it("/hello responds with 'World!'") {
    Get("/hello") ~> documentedHelloRoute ~> check {
      assert(responseAs[String] ==  "World!")
    }
}

it("/hello with query name=Bob responds with 'Hello Bob!'") {
    Get("/hello?name=Bob") ~> documentedHelloRoute ~> check {
      assert(responseAs[String] ==  "Hello Bob!")
    }
}

```
