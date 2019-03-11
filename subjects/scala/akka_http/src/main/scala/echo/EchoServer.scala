package echo

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.model._
import akka.stream.ActorMaterializer
import akka.http.scaladsl.server.Directives._
import akka.stream.scaladsl.Sink

import scala.concurrent.Future
import scala.util.Try
import com.useoptic.akka_http.scaladsl.Document.withOptic

object EchoServer extends App {

  implicit val system = ActorSystem()
  implicit val materializer = ActorMaterializer()

  val route = {
    extractRequest { request =>
      val code = Try(request.headers.find(i => i.name() == "return-status").get.value()).getOrElse("200")
      complete(HttpResponse(code.toInt, request.headers, request.entity))
    }
  }

  val bindingFuture = Http().bindAndHandle(withOptic(route), "localhost", 4000)

}
