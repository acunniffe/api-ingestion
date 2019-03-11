FROM node:8
WORKDIR .
COPY . .
RUN npm install
ENV OPTIC_SERVER_LISTENING=TRUE
ENV OPTIC_SERVER_HOST=testhost
CMD [ "npm", "start" ]

