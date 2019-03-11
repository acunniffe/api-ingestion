bundle install
bundle exec thin --max-persistent-conns 1024 --timeout 0 -R config.ru start -p 50003
