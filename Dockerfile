FROM hseeberger/scala-sbt

RUN \
 curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
 apt-get install -y nodejs

WORKDIR .
COPY . .
RUN npm install
ENV OPTIC_SERVER_LISTENING=TRUE
CMD [ "npm", "test" ]

