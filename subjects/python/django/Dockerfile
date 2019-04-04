FROM python
WORKDIR .
COPY . .

ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
RUN pip3 install pipenv
RUN pipenv install
CMD pipenv run python3 manage.py runserver 0.0.0.0:4000
