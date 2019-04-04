FROM python
WORKDIR .
COPY . .

ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
RUN python3 setup.py install
CMD flask-echo --port=4000 --host=0.0.0.0
