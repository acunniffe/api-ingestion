FROM hseeberger/scala-sbt:11.0.2_2.12.8_1.2.8
WORKDIR .
COPY . .

ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
RUN sbt package
CMD sbt run

