FROM paasmule/rbenv
WORKDIR .
COPY . .
RUN rbenv install 2.3.4
RUN gem install thin
RUN bundle install

ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
CMD exec thin --max-persistent-conns 1024 --timeout 0 -R config.ru start -p 4000

