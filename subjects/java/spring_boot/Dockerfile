FROM openjdk:8-jdk-alpine
VOLUME /tmp
COPY . .
ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
ENV OPTIC_SERVER_PORT=4000
RUN ./mvnw package
RUN ls -la
CMD java -jar ./target/echo-server-0.0.1-SNAPSHOT.jar