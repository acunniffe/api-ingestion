FROM hseeberger/scala-sbt:11.0.2_2.12.8_1.2.8
WORKDIR .
COPY . .

ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
RUN sbt assembly
CMD java -jar target/scala-2.12/akka_http-assembly-0.1.jar

