name := "akka_http"

version := "0.1"

scalaVersion := "2.12.8"

val akkaHttpVersion = "10.1.7"

libraryDependencies += "com.typesafe.akka" %% "akka-stream" % "2.5.19"
libraryDependencies += "com.typesafe.akka" %% "akka-testkit" % "2.5.19"
libraryDependencies += "com.typesafe.akka" %% "akka-http"   % akkaHttpVersion
libraryDependencies += "com.typesafe.akka" %% "akka-http-testkit" % akkaHttpVersion

mainClass in (Compile, run) := Some("echo.EchoServer")
