FROM node:8
RUN echo host.docker.internal
WORKDIR .
COPY . .
RUN npm install
EXPOSE 4000
ENV OPTIC_SERVER_LISTENING=TRUE
CMD [ "npm", "start" ]

