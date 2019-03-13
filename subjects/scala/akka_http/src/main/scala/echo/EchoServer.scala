package echo

import akka.actor.ActorSystem
import akka.http.scaladsl.{ConnectionContext, Http, HttpsConnectionContext}
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.model._
import akka.stream.ActorMaterializer
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.HttpApp
import akka.stream.scaladsl.Sink
import com.typesafe.sslconfig.akka.AkkaSSLConfig

import scala.concurrent.Future
import scala.util.Try
import com.useoptic.akka_http.scaladsl.Document.withOptic

import scala.concurrent.ExecutionContext.Implicits._
import scala.io.StdIn

object EchoServer extends HttpApp with App {

  //  implicit val system = ActorSystem()
  //  implicit val materializer = ActorMaterializer()

  val routes = withOptic(ctx => {
    val request = ctx.request
    val code = Try(request.headers.find(i => i.name() == "return-status").get.value()).getOrElse("200")
    ctx.complete(HttpResponse(code.toInt, request.headers, request.entity))
  })

  startServer("0.0.0.0", 4000)
}
