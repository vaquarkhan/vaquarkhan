Intro to Camel By Example
=============================

This project demonstrates a complete Camel application for a simple use case.  There are two flavors of the application: 1) A "simple" implementation that just solves the problem and 2) a "scalable" implementation that shows how little has to change in a Camel route in order to scale an application up.  The applications are written to follow Camel best practices, include unit test examples, and are deployable as a WAR in Tomcat, through the Maven Cargo plug-in on the command line, or in Fuse ESB.

Requirements:

* Maven 2.2.1 or 3.0 (http://maven.apache.org/)
* Java SE 6
* Apache ActiveMQ 5.5.1+ (for command line or servlet container deployment)

Optional Requirements:

* Fuse ESB Enterprise 7.1.0 (available free from the [Red Hat Customer Portal](https://access.redhat.com/home).  Note that the demo can be made to work on Apache ServiceMix or JBoss Fuse, but it is easiest to run the demo on the distribution identified here.)


## The Use Case

### Basic Requirements

* I need to poll a folder for new files
    * When I find a file I need to:
        * parse it,
        * validate it,
        * decompose it,
        * and move it to another folder
    * After I decompose the file I need to:
        * trigger a business process on the decomposed element and store the decomposed element

### Advanced Requirements

* No XML files or records within a file can go unprocessed
* Must scale past a single physical node

## Branches

This example contains two branches.  The "master" branch contains a full implementation and will work out-of-the-box.  The "start" branch contains boilerplate code, build configuration files, and implementation instructions for those that wish to explore implementing the example on their own.

## Building

To build

    mvn clean install

## Running the "simple" solution

The simple solution is a minimal solution to the use case that does not provide the ability to scale the application beyond a single node.  This solution is representative of the initial release of an application that could be achieved in a very short time period.

### Running the "simple" solution from the command line or from a servlet container

To run the simple solution, navigate to

    <EXAMPLE_ROOT>/simple-ingest-app
    
then execute the following command

    mvn package cargo:run
    
An embedded Tomcat will launch with the application automatically deployed.  The application will look for input files in

    ~/camel-by-example/source
    
The application log file output will write to 

    <EXAMPLE_ROOT>/simple-ingest-app/target/cargo/logs/container.log
      
To test the application, copy the files from

    <EXAMPLE_ROOT>/demo-data
    
to

    ~/camel-by-example/source

The application hosts a web enabled database browser that you can use to examine the results of the application execution.  Use a browser to navigate to [http://localhost:8082](http://localhost:8082).  When the login prompt appears, enter "*jdbc:h2:mem:test*" into the JDBC URL field and click the *Connect* button.

If you want to deploy the demo into your own servlet container, after building the demo, deploy the WAR file from *<EXAMPLE_ROOT>/simple-ingest-app/target* into the servlet container of your choice.  Apache Tomcat makes an excellent lightweight container for running the demo.

### Running the "simple" solution from Fuse ESB

After building the demo, add the following feature repository to the ESB by executing the following command in the ESB shell

    features:addurl mvn:com.fusesource.example.camel/camel-by-example-features/1.0-SNAPSHOT/xml/features

Install the simple solution feature by executing the following command in the ESB shell

    features:install camel-by-example-simple-ingest
    
The application log file output will write to the container log files.  You can watch the log files from the Fuse ESB console using the following command

    log:tail

To test the application, copy the files from

    <EXAMPLE_ROOT>/demo-data
    
to

    ~/camel-by-example/source

The application hosts a web enabled database browser that you can use to examine the results of the application execution.  Use a browser to navigate to [http://localhost:8082](http://localhost:8082).  When the login prompt appears, enter "*jdbc:h2:mem:test*" into the JDBC URL field and click the *Connect* button.

When deployed in Fuse ESB, the application exposes configuration options through the OSGi Configuration Admin Service.  You may override any of the configuration properties in the demo by defining the property in the Configuration Admin Service under the PID *com.fusesource.example.camel.simple.ingest*.  You do not need to define any properties.  The example only exposes configuration options in this manner to demonstrate the possibilities available through integration with the OSGi container.

## Running the "scalable" solution

The scalable solution is a more robust solution to the use case that does provides the ability to scale the application beyond a single node.  This solution is representative of a second relelease of an application and demonstrates how Camel allows you to modify and scale a route with relative ease.

### Running the "scalable" solution from the command line or from a servlet container

Before running the scalable solution, start an ActiveMQ broker instance on your machine using the default configuration settings (port 61616).

    <AMQ_HOME>/bin/activemq console
    
Alternatively you can alter the demo code to look for the broker at a different location by updating the settings in *<EXAMPLE_ROOT>/scalable-ingest-app/src/main/resources/META-INF/spring/scalable-ingest-app-core.xml* and *<EXAMPLE_ROOT>/scalable-process-app/src/main/resources/META-INF/spring/scalable-process-app-core.xml*.

To run the file polling portion of the solution, navigate to

    <EXAMPLE_ROOT>/scalable-ingest-app
    
then execute the following command

    mvn package cargo:run
    
An embedded Tomcat will launch with the application automatically deployed.  The application will look for input files in

    ~/camel-by-example/source
    
The application log file output will write to 

    <EXAMPLE_ROOT>/scalable-ingest-app/target/cargo/logs/container.log
      
To test the application, copy the files from

    <EXAMPLE_ROOT>/demo-data
    
to

    ~/camel-by-example/source
    
At this point, the file polling portion of the solution will have parsed the input files and enqueued messages onto the message broker.  However, you still need to start the message processing portion of the scalable application in order to process the enqueued messages.

To run the message processing portion of the solution, navigate to

    <EXAMPLE_ROOT>/scalable-process-app
    
then execute the following command

    mvn package cargo:run
    
The application log file output will write to 

    <EXAMPLE_ROOT>/scalable-process-app/target/cargo/logs/container.log

The application hosts a web enabled database browser that you can use to examine the results of the application execution.  Use a browser to navigate to [http://localhost:8082](http://localhost:8082).  When the login prompt appears, enter "jdbc:h2:mem:test" into the JDBC URL field and click the *Connect* button.

You can examine the health of the different portions of the application and the ActiveMQ broker by using JMX.  Jconsole, a JMX user interface provided with your JVM is the easiest way to access this information.

To launch JConsole type

    jcsonole
    
You can connect to the local running processes with the following names

* Cargo hosted Tomcat - org.apache.catalina.startup.Bootstrap start
* ActiveMQ - run.jar start

Examine the available MBeans in the deployed applications and ActiveMQ to examine performance and health metrics about the application and the message broker.

Also note that the example uses an in-memory database for idempotency behavior.  Obviously if you want to scale the solution beyond a single processing node, you will need to move to an external database or shared memory solution that can be accessed from multiple instances of the data processing portion of the application.  Camel supports both of these approaches.


### Running the "scalable" solution from Fuse ESB

The scalable solution is configured to leverage Fuse Fabric when deployed into Fuse ESB.  The sections below describe how to deploy the example into Fuse ESB with Fabric.  For more information on Fuse Fabric see [http://fuse.fusesource.org/fabric/docs/overview.html](http://fuse.fusesource.org/fabric/docs/overview.html).

#### Running with Fuse Fabric

The default configuration for the demo uses a messaging fabric based on ActiveMQ and is configured to work with a network of brokers using the logical names "mq-east" and "mq-west".  These logical names are automatically resolved to physical service locations using the runtime registry provided by Fabric.

The following instructions assume that you have a default installation of Fuse ESB with the default username and password pair of admin/admin.  See readme.txt file in Fuse ESB for instructions on how to enable the default account.

**NOTE** You can disable the default ActiveMQ instance in the container as it will not be used during this demo.  To disable the default instance, delete  `<CONTAINER_HOME>/etc/org.fusesource.mq.fabric.server-default.cfg`.

From a running instance of Fuse ESB Enterprise, execute the following commands in the console to create a new fabric.

    fabric:create
    
**NOTE** If the host name or IP of the machine on which you are running the demo changes frequently (typical for a developer laptop on multiple networks), it is recommended to use the manual IP resolver when creating the fabric as follows `fabric:create -g manualip -r manualip -m 127.0.0.1`.
    
From the same console, execute the following commands to provision the profile for Fuse Management Console into Fuse ESB and to minimize the footprint of the  ESB instance.  Deploying the management console will make it easier to visualize the actions described in the following steps.

    fabric:container-remove-profile root fuse-esb-full
    fabric:container-add-profile root fmc
    
Log into the management console by navigating to [http://localhost:8181/](http://localhost:8181/) in your browser.  Substitute the host name of the machine running Fuse ESB for "localhost" if you are not running Fuse ESB locally.  These instructions use the fabric console commands heavily.  While all actions performed through the console in this demo can be performed using the management console user interface, the command line is more concise and involves less clicking.

From the same console, execute the following commands in the console to create a profile for the MQ East brokers.

    mq-create --group mq-east --networks mq-west mq-east-broker
    profile-edit -p org.fusesource.mq.fabric.server-mq-east-broker/network.userName=admin mq-east-broker
    profile-edit -p org.fusesource.mq.fabric.server-mq-east-broker/network.password=admin mq-east-broker
    
At this point you have created a new fabric profile for brokers that are part of the MQ East group.  You can view the new profile in the management console by navigating to the profiles tab.

From the same console, execute the following commands in the console to create a profile for the MQ West brokers.

    mq-create --group mq-west --networks mq-east mq-west-broker
    profile-edit -p org.fusesource.mq.fabric.server-mq-west-broker/network.userName=admin mq-west-broker
    profile-edit -p org.fusesource.mq.fabric.server-mq-west-broker/network.password=admin mq-west-broker

At this point you have created a new fabric profile for brokers that are part of the MQ West group.  You can view the new profile in the management console by navigating to the profiles tab.

From the same console, execute the following commands to provision new containers to host the ActiveMQ brokers in your fabric.

    container-create-child --profile mq-east-broker root MQ-East 2
    container-create-child --profile mq-west-broker root MQ-West 2
    
At this point you will have created 4 new JVM processes, each dedicated to hosting an ActiveMQ instance.  Two of the processes represent a master slave pair for the MQ-East group and two of the processes represent a master slave pair for the MQ-West group.  You now have a network of brokers.  The logical endpoint information for the network of brokers has been published into the Fabric registry and is accessible by other applications deployed in the Fabric.  You can view the deployed containers, their provisioned profiles, and information about the container and ActiveMQ through the management console that you deployed earlier.

**NOTE** If the machine hosting the demo struggles with the 4 broker instances, you may stop one instance of the MQ East group and one instance of the MQ West group.  You will not be able to explore broker failover in this configuration; however, you will free up some resources on the machine for other uses.

From the same console, execute the following commands to create a new profile for the file ingestion portion of the example application.

    profile-create --parents fabric camel-by-example-scalable-ingest
    profile-edit -r mvn:com.fusesource.example.camel/camel-by-example-features/1.0-SNAPSHOT/xml/features -f camel-by-example-scalable-ingest camel-by-example-scalable-ingest
    
You now have a new profile named "camel-by-example-scalable-ingest".  This profile deploys the file ingestion portion of the solution.  Next we create another profile for the data processing portion of the solution.

From the same console, execute the following commands to create a new profile for the data processing portion of the example application.

    profile-create --parents fabric camel-by-example-scalable-process
    profile-edit -r mvn:com.fusesource.example.camel/camel-by-example-features/1.0-SNAPSHOT/xml/features -f camel-by-example-scalable-process camel-by-example-scalable-process

You now have a new profile named "camel-by-example-scalable-process".  This profile deploys the data processing portion of the solution.  At this point in time, we can create a new container instance and provision the two new profiles onto that instance.

    container-create-child --profile camel-by-example-scalable-process --profile camel-by-example-scalable-ingest root App-Main

In this example, the file ingestion portion of the application enqueues messages on the MQ East brokers and the data processing portion of the application dequeues messages from the MQ West brokers in order to demonstrate the network of brokers.  A typical production deployment would leverage the appropriate brokers based upon geographic location and network firewall rules.  Also note that the example uses an in-memory database for idempotency behavior.  Obviously if you want to scale the solution beyond a single processing node, you will need to move to an external database or shared memory solution that can be accessed from multiple instances of the data processing portion of the application.  Camel supports both of these approaches.

The application will look for input files in

    ~/camel-by-example/source
    
The application log file output will write to the output of the "App" container.  The easiest way to view this output is to connect to the container through the Fuse ESB console and tail the log file through the console.  Perform the following steps to observe the application log output.

    container-connect App
    log:tail
    
Press ctrl-c to exit tail and type `exit` to leave the App container's console.
     
To test the application, copy the files from

    <EXAMPLE_ROOT>/demo-data
    
to

    ~/camel-by-example/source

The application hosts a web enabled database browser that you can use to examine the results of the application execution.  Use a browser to navigate to [http://localhost:8082](http://localhost:8082).  When the login prompt appears, enter "jdbc:h2:mem:test" into the JDBC URL field and click the *Connect* button.

You can examine the health of the different portions of the application and the ActiveMQ broker by using JMX.  Jconsole, a JMX user interface provided with your JVM is the easiest way to access this information.

To launch JConsole type

    jcsonole
    
As there are a number of JVMs running at this point, it is easiest to use the JMX URL for the container you are interested in rather than trying to use the process  list.  To find the JMX URL for the container of interest, use the management console to locate the container of interest and click the *JMX* button on the page.  Copy the URL to JConsole and provide the correct credentials for access.

One may add additional data processing instances on additional container instances by executing the following commands.  Note that we need to create a new profile for additional deployments due to port conflicts when running the instances on the same machine (due to the in-memory database web console launched from the application).  Normally, each instance would deploy to a different host and such one-off profiles are not needed.

    profile-create --parents fabric camel-by-example-scalable-process-2
    profile-edit -r mvn:com.fusesource.example.camel/camel-by-example-features/1.0-SNAPSHOT/xml/features -f camel-by-example-scalable-process camel-by-example-scalable-process-2
    profile-edit -p com.fusesource.example.camel.scalable.process/com.fusesource.example.camel.h2.web.port=8083 camel-by-example-scalable-process-2
    container-create-child --profile camel-by-example-scalable-process-2 root App-Process

At this point in time a second instance of the data processing portion of the application is running in the App-Process container.  To view the log output of this instance use the following commands

    container-connect App-Process
    log:tail

If you return the sample file to the input directory you can observe that each instance of the data processing portion of the application only receives some of the data.  These instances of the data processing logic act as competing consumers on the message queue and serve to load balance processing across multiple hosts.

#### Running without Fuse Fabric

You can also run the scalable solution in Fuse ESB without Fabric by adding the desired features to the container and providing a traditional "failover:" style URL to the connection factories used in the solution.

The following Fuse ESB console commands will provision the solution into the container.

    features:addurl mvn:com.fusesource.example.camel/camel-by-example-features/1.0-SNAPSHOT/xml/features
    
Use the console to provision configuration properties for the scalable solution.  These properties will disable the use of Fabric and use explicit configuration settings for the physical location of the message broker.  Note that you will need to identify the port that the embedded broker instance is using and modify the broker URLs below if you are not using a broker running on port 61616.

    config:edit com.fusesource.example.camel.scalable.ingest
    config:propappend -p com.fusesource.example.camel.scalable.ingest com.fusesource.example.camel.jms.brokerUrl failover:(tcp://localhost:61616)
    config:update
    
    config:edit com.fusesource.example.camel.scalable.process
    config:propappend -p com.fusesource.example.camel.scalable.process com.fusesource.example.camel.jms.brokerUrl failover:(tcp://localhost:61616)
    config:update

Install the scalable solution features by executing the following command in the ESB shell

    features:install camel-by-example-scalable-ingest
    features:install camel-by-example-scalable-process
    
The application log file output will write to the container log files.  You can watch the log files from the Fuse ESB console using the following command

    log:tail

To test the application, copy the files from

    <EXAMPLE_ROOT>/demo-data
    
to

    ~/camel-by-example/source

The application hosts a web enabled database browser that you can use to examine the results of the application execution.  Use a browser to navigate to [http://localhost:8082](http://localhost:8082).  When the login prompt appears, enter "*jdbc:h2:mem:test*" into the JDBC URL field and click the *Connect* button.

When deployed in Fuse ESB, the application exposes configuration options through the OSGi Configuration Admin Service.  You may override any of the configuration properties in the demo by defining the property in the Configuration Admin Service under the PID *com.fusesource.example.camel.scalable.ingest* and *com.fusesource.example.camel.scalable.process*.  You do not need to define any properties.  The example only exposes configuration options in this manner to demonstrate the possibilities available through integration with the OSGi container.
