# Install Java 11 + Scala Enviroment
FROM hseeberger/scala-sbt

# Install Node Enviroment
RUN \
 curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
 apt-get install -y nodejs

# Install Ruby Enviroment
RUN apt-get update
RUN apt-get install -y --force-yes build-essential curl git
RUN apt-get install -y  zlib1g-dev libssl1.0-dev libreadline-dev libyaml-dev libxml2-dev libxslt-dev gnupg gnupg2
RUN apt-get clean
RUN \curl -sSL https://get.rvm.io | bash -s stable --ruby
RUN rvm install 2.3.7

WORKDIR .
COPY . .
RUN npm install
ENV OPTIC_SERVER_LISTENING=TRUE
CMD [ "npm", "test" ]

