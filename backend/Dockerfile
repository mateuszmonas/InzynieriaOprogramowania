FROM openjdk:11-jre
ENV HOME /home/root
WORKDIR /
COPY target/backend.jar backend.jar
CMD ["/bin/bash", "-c", "java -agentlib:jdwp=transport=dt_socket,address=*:5005,server=y,suspend=n -jar backend.jar"]