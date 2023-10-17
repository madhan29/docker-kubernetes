# Stage 1: Build Image
FROM python:3.10-slim-bullseye AS build-image

# Update and install system dependencies
RUN apt-get update && \
    apt-get full-upgrade -y && \
    apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        default-libmysqlclient-dev \
        libpq-dev \
        pkg-config \
        unixodbc-dev \
        unzip

# Copy source code into /srcdir
COPY . /srcdir

# Set up virtual environment
RUN python3 -m venv /virtualenv
ENV PATH="/virtualenv/bin:$PATH"

# Install packages
RUN pip install \
    /srcdir \
    cx-Oracle \
    ibm-db-sa \
    mysqlclient \
    psycopg2 \
    pymssql \
    pyodbc

# Download and extract Oracle Instant Client
RUN curl \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
    -o instantclient.zip && \
    unzip instantclient.zip && \
    mkdir -p /opt/oracle/instantclient && \
    mv instantclient*/* /opt/oracle/instantclient

# Stage 2: Final Image
FROM python:3.10-slim-bullseye

# Update and install system dependencies
RUN apt-get update && \
    apt-get full-upgrade -y && \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg2 \
        libaio1 \
        libmariadb-dev-compat \
        libodbc1 \
        libpq5 \
        libxml2 && \
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg && \
    (. /etc/os-release; echo "deb https://packages.microsoft.com/debian/$VERSION_ID/prod $VERSION_CODENAME main") > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 && \
    rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man && \
    apt-get clean

# Copy dependencies from build stage
COPY --from=build-image /virtualenv /virtualenv
COPY --from=build-image /opt /opt

# Set environment variables
ENV PATH="/virtualenv/bin:$PATH"
ENV VIRTUAL_ENV="/virtualenv"
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"

# Expose port
EXPOSE 9560/tcp

# Set the entry point command
ENTRYPOINT ["query-exporter", "/config.yml", "-H", "0.0.0.0"]
