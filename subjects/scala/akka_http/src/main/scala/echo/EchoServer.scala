package echo

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.model._
import akka.stream.ActorMaterializer
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.HttpApp
import akka.stream.scaladsl.Sink

import scala.concurrent.Future
import scala.util.Try
import com.useoptic.akka_http.scaladsl.Document.withOptic

import scala.concurrent.ExecutionContext.Implicits._

object EchoServer extends HttpApp with App {

  override protected def routes = {
    extractRequest { request =>
      val code = Try(request.headers.find(i => i.name() == "return-status").get.value()).getOrElse("200")
      complete(HttpResponse(code.toInt, request.headers, request.entity))
    }
  }

  startServer("0.0.0.0", 4000)
}
