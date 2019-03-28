FROM python
WORKDIR .
COPY . .

ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
RUN pip3 install optic-document-flask==0.1.3
RUN python3 setup.py install
CMD flask-echo --port=4000 --host=0.0.0.0
