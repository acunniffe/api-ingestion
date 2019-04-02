package com.useoptic.akka_http.scaladsl

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.Host
import akka.http.scaladsl.server.RouteResult.Complete
import akka.http.scaladsl.server.{Route, RouteResult}
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.stream.ActorMaterializer

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.Try

object Document {

  val host = sys.env.getOrElse("OPTIC_SERVER_HOST", "localhost")

  //If 'optic-watching' environment flag is set
  //this method wraps a 'Route' instance with a logging directive that forwards data to Optic
  def withOptic(route: akka.http.scaladsl.server.Route): Route = {
    import akka.http.scaladsl.server.directives.{DebuggingDirectives, LoggingMagnet}
    if (sys.env.contains("OPTIC_SERVER_LISTENING"))
      DebuggingDirectives.logRequestResult(LoggingMagnet(_ => logRequestAndResponse))(route)
    else route
  }

  //Standard Configuration for the Optic Proxy Server
  def forwardToRequestLogging(request: HttpRequest) = {
    val a = Try(request.withUri(request.uri.withHost(host).withPort(30334).withScheme("http")))
    a.get
  }

  def forwardToResponseLogging(request: HttpRequest) = request.withUri(request.uri.withHost(host).withPort(30335).withScheme("http"))

  private implicit val testActorSystem = ActorSystem("optic-proxy-routing")
  private implicit val materializer = ActorMaterializer()

  //Pipes the Request + Response to the logging endpoints on the local Optic Proxy
  private def logRequestAndResponse(request: HttpRequest)(res: RouteResult): Unit = {
    res match {
      case Complete(response) => {
        val updatedRequest = forwardToRequestLogging(request)

        //Requests are forwarded to the request logging port
        Http().singleRequest(updatedRequest).foreach(i => {
          //A 'requestId' is sent back in the request body
          Unmarshal(i.entity).to[String].foreach(interactionId => {
            val logResponseURI = Uri("/interactions/" + interactionId + "/status/" + response.status.intValue().toString)
            //The response is forwarded to :{response logging port}/response/:interactionId/:statusCode
            val a = Http().singleRequest(forwardToResponseLogging(HttpRequest(
              HttpMethods.POST,
              logResponseURI,
              response.headers,
              HttpEntity.apply(response.entity.contentType, response.entity.dataBytes),
              response.protocol
            )))

          })
        })
      }
      case _ => //Rejected requests are ignored
    }
  }

}
