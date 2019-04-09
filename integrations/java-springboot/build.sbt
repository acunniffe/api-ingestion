import scala.xml.{Node => XmlNode, NodeSeq => XmlNodeSeq, _}
import scala.xml.transform.{RewriteRule, RuleTransformer}

name := "document-springboot"
organization := "com.useoptic"
version := "0.1.2"

crossPaths := false
scalaVersion := "2.12.8"

libraryDependencies ++= Seq(
  "org.springframework.boot" % "spring-boot-starter-web" % "2.1.3.RELEASE" % "provided",
  "org.springframework.boot" % "spring-boot-configuration-processor" % "2.1.3.RELEASE" % "provided"
)

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
scmInfo := Some(
  ScmInfo(
    url("https://github.com/opticdev/api-ingestion"),
    "scm:git@github.com:opticdev/api-ingestion.git"
  )
)

developers := List(
  Developer(id="acuniffe", name="Aidan Cunniffe", email="acunniffe@gmail.com", url=url("http://github.com/acunniffe"))
)