name := "akka_http"

version := "0.1"

scalaVersion := "2.12.8"

val akkaHttpVersion = "10.1.7"

libraryDependencies += "com.useoptic" %% "document-akka-http" % "0.2.0"

libraryDependencies += "com.typesafe.akka" %% "akka-stream" % "2.5.19"
libraryDependencies += "com.typesafe.akka" %% "akka-testkit" % "2.5.19"
libraryDependencies += "com.typesafe.akka" %% "akka-http"   % akkaHttpVersion
libraryDependencies += "com.typesafe.akka" %% "akka-http-testkit" % akkaHttpVersion

enablePlugins(AssemblyPlugin)

mainClass in (Compile, run) := Some("echo.EchoServer")
mainClass in assembly := Some("echo.EchoServer")
