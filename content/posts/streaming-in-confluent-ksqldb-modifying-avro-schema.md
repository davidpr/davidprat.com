---
title: "Streaming in Confluent KsqlDB: Modifying AVRO Schema"
date: "2020-12-01T15:00:55"
excerpt: "[vc_row][vc_column][vc_column_text] Streaming in Confluent KsqlDB: Modifying AVRO Schema [/vc_column_text][/vc_column][/vc_row] In the context of streaming applications Kafka has been a very used technology to solve real"
cover: "/posts/streaming-in-confluent-ksqldb-modifying-avro-schema/ksqldb-squared.png"
---
\[vc\_row\]\[vc\_column\]\[vc\_column\_text\]

## Streaming in Confluent KsqlDB: Modifying AVRO Schema

\[/vc\_column\_text\]\[/vc\_column\]\[/vc\_row\]

In the context of streaming applications Kafka has been a very used technology to solve real time and exactly-once-processing problems by many big and medium companies. It also has been used as a temporary logs in which all applications could benefit from brokerage and read from multiple destinations the same incoming data. With the introduction of cloud services such as Kinesis, MSK, Firehose, etc. infrastructure management has been reduced and with so the associated costs. This has been called “the democratization of streaming” because it has allowed smaller companies to use these powerful technologies without spending huge figures in large IT teams. However, there still was a caveat in this matter: programming a Kafka application was reduced to using Java and the development complexity was higher than using Spark Structured Streaming or even Flink or Storm. Moreover, the later frameworks provide much more powerful calls to manipulate data on the fly. Whether in form of microbatches such as the case of Spark Structured Streaming and Storm in its Trident version, or in the form of real time such as in Flink or Storm by default. Gives this, it is very common to see architectures with Kafka only being at the front of the data pipeline gathering and storing incoming data tuples as the fastest technology and coupling some other more friendly framework to process and manipulate data from Kafka even if after the Kafka step there only was a single application.

However, with the introduction of ksqlDB this default architecture is very likely to change for many of the forecomming projects. KsqlDB gives the programmer a SQL-like interface to operate with Kafka Streams. This means that by typing SQL queries it is possible to manipulate how the streams make data transformations to the incoming data into the Kafka cluster. With this possibility, if data transformations doesn’t need to be very sophisticated, it is possible to skip using other frameworks such as Spark Streaming or Flink and do everything inside of the same Kafka cluster.

A very interesting characteristic of Kafka in conjunction with the Confluent Schema registry is the possibility to report changes in the forecoming data and thus being able to support those new formed data correctly. In this post we’ll see how to locally set up Kafka, code a simple application and change the data format what will require from a change in the Schema Registry. Furthermore, the special point will be using the Confluent Control Center instead of the command line for common tasks such as monitoring the Kafka cluster, the processed data and looking at the Schema changes.

#### Configuration of the environment

Let’s first configure the environment. Basically we need to download and configure Java and Kafka but for Kafka we will be using the Confluent Platform, which gives the potential of ksqlDB and the Confluent Control Center. Notice that the later feature is a paid feature but there is free licence when using it in a Kafka cluster with a single Kafka broker.

https://kafka.apache.org/downloads

##### Install Java

It is very likely that you already have Java installed. In this tutorial java 1.8 has been used so make sure you have this or a later version by typing:

java -version

If no java is installed in your machine you can follow the instructions [here](https://mkyong.com/java/how-to-install-java-on-mac-osx/).

##### Install Confluent Platform

Now install the Confluent platform. Remember that this already has everything related to Kafka included in the same folder.

https://www.confluent.io/download/

make a soft link to access to the latest version and export the PATH variable so you have the needed binaries conveniently accessible.

ln -s confluent-6.0.0/ confluent
export PATH=${PATH}:/Users/david/bigdata/confluent/bin
kafka-topics

Now let’s install the standalone Confluent CLI (command line interface). Start and stop and interrogate the state of the Confluent platform.

curl -L https://cnfl.io/cli | sh -s -- -b /Users/david/bigdata/confluent/bin

Check the confluent command is well pointed.

./confluent

Set the confluent environment variable.

export CONFLUENT\_HOME=/Users/david/bigdata/confluent

(export PATH=”${CONFLUENT\_HOME}/bin:$PATH”)

(For more information go: [here](https://docs.confluent.io/current/confluent-cli/command-reference/local/services/ksql-server/confluent_local_services_ksql-server_start.html))

##### Running the Confluent Platform and testing it

confluent local services ksql-server start
confluent local services ksql-server status
confluent local services status

_The local commands are intended for a single-node development environment only_

_NOT for production usage. https://docs.confluent.io/current/cli/index.html_

_Using CONFLUENT\_CURRENT: /var/folders/1w/j7gzxdm92h154vzv04th5v1c0000gn/T/confluent.553577_

_Connect is \[DOWN\]_

_Control Center is \[DOWN\]_

_Kafka is \[UP\]_

_Kafka REST is \[DOWN\]_

_ksqlDB Server is \[UP\]_

_Schema Registry is \[DOWN\]_

_ZooKeeper is \[UP\]_

Now that the ksqlDB server is up let’s start to play a bit with the system:

Create a topic in Kafka Cluster.

kafka-topics --zookeeper localhost:2181 --create --partitions 1 --replication-factor 1 --topic USERS

Now in a separate terminal turn the ksqlDB server by typing ksql. Then perform the following commands. You’ll see that the commands are very self-explanatory. However, if more information is required you can consult a list of ksql commands [here](https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-reference/quick-reference/).

ksql> list topics;

\>;

_Kafka Topic                 | Partitions | Partition Replicas_

_—————————————————————_

_USERS                       | 1          | 1_                  

_default\_ksql\_processing\_log | 1          | 1_                  

_test                        | 1          | 1_                  

kafka-console-producer --broker-list localhost:9092 --topic USERS

_\>Alice,US_

_\>Bob,GB_

_\>Carole,AU_

_\>Dan,US_

ksql> print 'USERS'

_\>;_

_Key format: ¯\\\_(ツ)\_/¯ – no data processed_

_Value format: KAFKA\_STRING_

_rowtime: 2020/11/15 09:15:04.592 Z, key: <null>, value: Carole,AU_

_rowtime: 2020/11/15 09:15:13.726 Z, key: <null>, value: Dan,US_

_^CTopic printing ceased_

_ksql> print 'USERS' from beginning;_

_Key format: ¯\\\_(ツ)\_/¯ – no data processed_

_Value format: KAFKA\_STRING_

_rowtime: 2020/11/15 09:13:15.670 Z, key: <null>, value: Alice,US_

_rowtime: 2020/11/15 09:14:27.093 Z, key: <null>, value: Bob,GB_

_rowtime: 2020/11/15 09:15:04.592 Z, key: <null>, value: Carole,AU_

_rowtime: 2020/11/15 09:15:13.726 Z, key: <null>, value: Dan,US_

ksql> print ‘USERS’ from beginning limit 2;

_Key format: ¯\\\_(ツ)\_/¯ – no data processed_

_Value format: KAFKA\_STRING_

_rowtime: 2020/11/15 09:13:15.670 Z, key: <null>, value: Alice,US_

_rowtime: 2020/11/15 09:14:27.093 Z, key: <null>, value: Bob,GB_

_Topic printing ceased_

ksql> print 'USERS' from beginning interval 2 limit 2;

_Key format: ¯\\\_(ツ)\_/¯ – no data processed_

_Value format: KAFKA\_STRING_

_rowtime: 2020/11/15 09:13:15.670 Z, key: <null>, value: Alice,US_

_rowtime: 2020/11/15 09:15:04.592 Z, key: <null>, value: Carole,AU_

_Topic printing ceased_

ksql>create stream users\_stream (name VARCHAR, countrycode VARCHAR) WITH (KAFKA\_TOPIC='USERS', VALUE\_FORMAT='DELIMITED');
ksql> list streams;

_Stream Name         | Kafka Topic                 | Format_    

_—————————————————————_

_KSQL\_PROCESSING\_LOG | default\_ksql\_processing\_log | JSON_      

_USERS\_STREAM        | USERS                       | DELIMITED_

* * *

_SET 'auto.offset.reset'='earliest';_
ksql> list streams;
_select name,countrycode  from users\_stream EMIT CHANGES;_
_select name,countrycode  from users\_stream EMIT CHANGES limit 1;_
_select countrycode, count(\*) from users\_stream group by countrycode EMIT CHANGES;_ 

_+————————————-+————————————-+_

_|COUNTRYCODE                          |KSQL\_COL\_0                           |_

_+————————————-+————————————-+_

_|GB                                   |1                                    |_

_|AU                                   |1                                    |_

_|US                                   |2                                    |_

ksql> drop stream if exists users\_stream delete topic;
show streams,
show topics;

#### Coding the application

We already have played somehow with the ksqlDB. Created a topic, published data to the topic and even created and dropped streams. Now it’s time to make the further step and see how to use the Confluent Control Center and how to apply changes to an AVRO schema.

First of all,, let’s stop the confluent services and start them again. But this time we are going to start all them by simply specifying start without referring to anyone in special.

confluent local services start

To access the Confluent Control Center, go to your browser and type localhost using the 9021 port. A simple resume of the clusters will appear. In this case there only one cluster with a single broker.

![](/posts/streaming-in-confluent-ksqldb-modifying-avro-schema/CCC1.png)

Looking into the menu more detailed information regarding the Kafka cluster and the ksqlDB is revealed.

![](/posts/streaming-in-confluent-ksqldb-modifying-avro-schema/CCC2.png)

Let’s create a new topic, which will represent complains from the users.

kafka-topics --zookeeper localhost:2181 --create --partitions 1 --replication-factor 1 --topic COMPLAINTS\_AVRO

Now let’s create a stream for the complains topic and insert a record in AVRO format. Finally, we describe the stream.

ksql
create stream complaints\_avro with (kafka\_topic='COMPLAINTS\_AVRO', value\_format='AVRO');
kafka-avro-console-producer --broker-list localhost:9092 --topic COMPLAINTS\_AVRO --property value.schema='{ "type": "record", "name": "myrecord", "fields": \[ {"name": "customer\_name", "type": "string" }, {"name": "complaint\_type", "type": "string" },{"name": "trip\_cost", "type": "float" }, {"name": "new\_customer", "type": "boolean"} \] }' << EOF
{"customer\_name":"Carol", "complaint\_type":"Late arrival", "trip\_cost": 19.60, "new\_customer": false}
EOF

ksql> describe extended complaints\_avro;

_Name                 : COMPLAINTS\_AVRO_

_Type                 : STREAM_

_Timestamp field      : Not set – using <ROWTIME>_

_Key format           : KAFKA_

_Value format         : AVRO_

_Kafka topic          : COMPLAINTS\_AVRO (partitions: 1, replication: 1)_

_Statement            : CREATE STREAM COMPLAINTS\_AVRO (CUSTOMER\_NAME STRING, COMPLAINT\_TYPE STRING, TRIP\_COST DOUBLE, NEW\_CUSTOMER BOOLEAN) WITH (KAFKA\_TOPIC=’COMPLAINTS\_AVRO’, SCHEMA\_ID=1, VALUE\_FORMAT=’AVRO’);_

_Field          | Type_            

_———————————-_

_CUSTOMER\_NAME  | VARCHAR(STRING)_

_COMPLAINT\_TYPE | VARCHAR(STRING)_

_TRIP\_COST      | DOUBLE_          

_NEW\_CUSTOMER   | BOOLEAN_         

_———————————-_

_Local runtime statistics_

_————————_

_(Statistics of the local KSQL server interaction with the Kafka topic COMPLAINTS\_AVRO)_

The topic has been created and the schema can be seen in the Confluent Control Center (CCC). Mind the available options regarding to the schema.

![](/posts/streaming-in-confluent-ksqldb-modifying-avro-schema/ccc3.png)

Now let’s create the version 2 of the schema by executing the following command.

kafka-avro-console-producer --broker-list localhost:9092 --topic COMPLAINTS\_AVRO --property value.schema=' {"type": "record","name": "myrecord","fields": \[{"name": "customer\_name", "type": "string" }, {"name": "complaint\_type", "type": "string" }, {"name": "trip\_cost", "type": "float" }, {"name": "new\_customer", "type": "boolean"}, {"name": "number\_of\_rides", "type": "int", "default" : 1}\]}' << EOF
{"customer\_name":"Ed", "complaint\_type":"Dirty car", "trip\_cost": 29.10,"new\_customer": false, "number\_of\_rides": 22}
EOF

And when going back to the CCC it is possible to see the schema version 2. Notice how it is possible to make a diff between the different versions. In this case we only have the two created versions.

![](/posts/streaming-in-confluent-ksqldb-modifying-avro-schema/ccc4-1.png)

Versions can also be retrieved by applying curl command over the CCC.

curl -s -X GET http://localhost:8081/subjects/COMPLAINTS\_AVRO-value/versions

\[1,2\]**%**

Let’s have a look to the streams to understand what’s the behaviour of them when we change the schema.

describe the old stream:

describe complaints\_avro;

You’ll see that despite the avro schema was changed the old stream still treat the data according to the first schema.

To operate with the second or newer schema let’s create a new stream:

create stream complaints\_avro\_v2 with (kafka\_topic='COMPLAINTS\_AVRO', value\_format='AVRO');

Now describe the newer stream to discover that it takes into account the new field fo the updated schema

describe complaints\_avro\_v2;

An additional check is to directly consult both streams:

ksql> select \* from complaints\_avro EMIT CHANGES;

+—————–+—————–+—————–+—————–+

|CUSTOMER\_NAME    |COMPLAINT\_TYPE   |TRIP\_COST        |NEW\_CUSTOMER     |

+—————–+—————–+—————–+—————–+

^CQuery terminated

ksql> select \* from complaints\_avro\_v2 EMIT CHANGES;

+————-+————-+————-+————-+————-+

|CUSTOMER\_NAME|COMPLAINT\_TYP|TRIP\_COST    |NEW\_CUSTOMER |NUMBER\_OF\_RID|

|             |E            |             |             |ES           |

+————-+————-+————-+————-+————-+

^CQuery terminated

If no users where shown it’s because you closed the ksql session and you lost the environment configuration. Just type again:

SET 'auto.offset.reset'='earliest';

You can achieve the same effect by using the Confluent Control Center. Set the knobs just like the image below:

![](/posts/streaming-in-confluent-ksqldb-modifying-avro-schema/ccc5.png)

* * *

* * *

#### Conclusions

The installation and setup of the Confluent Platform has been extremely easy. The idea of packing everything into a folder and being able to execute a Kafka cluster in local with Kafka streams and providing the ksqlDB interface it’s really a game changer. Going to a cluster installation would be much less easy but despite that, the ksqlDB represents that so called democracy into all companies being able to use such a powerful technology without needing to use other total privative licence that are expensive.

An interesting feature of ksqlDB is the possibility to define UDFs of UDAFs when the transformations we want to make to the streams are so complicated that there are not predefined functions available. This adds even more power to ksqlDB and its possibilities for the architect to drop off from the data pipeline other technologies such as Flink, Storm or Spark Structured Streaming.
