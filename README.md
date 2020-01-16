# WorkQueue

## Getting Started

### 1 - Starting Confluent

#### 1.1. Localhost

```shell script
cd confluent
docker-compose -f docker-compose-localhost.yml up
```

## Setup volumes for persisting broker/zookeeper data

```shell script
sudo mkdir -p /var/kafka
sudo mkdir -p /var/zk-data
sudo mkdir -p /var/zk-txn-logs
sudo mkdir -p /var/kafka-data

sudo chown -R 12345 /var/kafka
```
#### 1.2. Custom host

Make a copy of the docker-compose-localhost.yml and name it docker-compose-`your-host`.yml

Change the value of `KAFKA_ADVERTISED_LISTENERS` from `localhost` to `your-host`.

```yaml
  broker:
...
    environment:
...
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker:29092,PLAINTEXT_HOST://your-host:9092
```

```shell script
cd confluent
docker-compose -f docker-compose-your-host.yml up
```

### 2 Open Control Center
Navigate to the Control Center web interface at http://localhost:9021/.
