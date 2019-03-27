FROM python
WORKDIR .
COPY . .
RUN python3 setup.py install
CMD flask-echo --port=4000 --host=0.0.0.0
