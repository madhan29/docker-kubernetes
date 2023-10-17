FROM redhat/ubi8:8.5
RUN yum -y install java-17-openjdk-headless && yum update -y && yum clean all -y
USER root
RUN su -
RUN yum install -y sudo
RUN yum install -y unzip
ADD . /opt/docker
WORKDIR /opt/docker
RUN curl -fsSL -o kafka-lag-exporter-0.8.2.zip https://github.com/seglo/kafka-lag-exporter/releases/download/v0.8.2/kafka-lag-exporter-0.8.2.zip
RUN unzip kafka-lag-exporter-0.8.2.zip -d /opt/docker
RUN ls /opt/docker/
CMD ["/opt/docker/kafka-lag-exporter-0.8.2/bin/kafka-lag-exporter", "-Dconfig.file=/opt/docker/conf/application.conf", "-Dlogback.configurationFile=/opt/docker/conf/logback.xml"]