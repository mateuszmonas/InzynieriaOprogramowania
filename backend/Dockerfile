FROM openjdk:11-jre
EXPOSE 8080:8080
ENV HOME /home/root
WORKDIR /
COPY target/backend.jar backend.jar
CMD ["/bin/bash", "-c", "java -agentlib:jdwp=transport=dt_socket,address=*:5005,server=y,suspend=n -jar backend.jar"]