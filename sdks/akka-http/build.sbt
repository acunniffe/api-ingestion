import scala.xml.{Node => XmlNode, NodeSeq => XmlNodeSeq, _}
import scala.xml.transform.{RewriteRule, RuleTransformer}

name := "document-akka-http"

organization := "com.useoptic"

version := "0.1.0"

scalaVersion := "2.12.8"

val akkaHttpVersion = "10.1.7"

libraryDependencies += "com.typesafe.akka" %% "akka-stream" % "2.5.19" % "provided"
libraryDependencies += "com.typesafe.akka" %% "akka-testkit" % "2.5.19" % "provided"
libraryDependencies += "com.typesafe.akka" %% "akka-http"   % akkaHttpVersion % "provided"
libraryDependencies += "com.typesafe.akka" %% "akka-http-testkit" % akkaHttpVersion % "provided"

pomPostProcess := { (node: XmlNode) =>
  new RuleTransformer(new RewriteRule {
    override def transform(node: XmlNode): XmlNodeSeq = node match {
      case e: Elem if e.label == "dependency" && e.child.exists(child => child.label == "scope" && child.text == "provided") =>
        val organization = e.child.filter(_.label == "groupId").flatMap(_.text).mkString
        val artifact = e.child.filter(_.label == "artifactId").flatMap(_.text).mkString
        val version = e.child.filter(_.label == "version").flatMap(_.text).mkString
        Comment(s"provided dependency $organization#$artifact;$version has been omitted")
      case _ => node
    }
  }).transform(node).head
}


publishTo := {
  val nexus = "https://oss.sonatype.org/"
  val profileM = sonatypeStagingRepositoryProfile.?.value

  if (isSnapshot.value) {
    Some("snapshots" at nexus + "content/repositories/snapshots")
  } else {
    val staged = profileM map { stagingRepoProfile =>
      "releases" at nexus +
        "service/local/staging/deployByRepositoryId/" +
        stagingRepoProfile.repositoryId
    }

    staged.orElse(Some("releases" at nexus + "service/local/staging/deploy/maven2"))
  }
}

sonatypeProfileName := "com.useoptic"
publishMavenStyle := true
licenses := Seq("MIT" -> url("https://opensource.org/licenses/MIT"))
homepage := Some(url("https://useoptic.com"))
credentials += Credentials(Path.userHome / ".sbt" / "sonatype_credential")
