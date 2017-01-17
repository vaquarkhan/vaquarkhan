Apache Camel Developer's Cookbook Samples
=========================================

This project contains the sample code for the [_Apache Camel Developer's Cookbook_](http://www.packtpub.com/apache-camel-developers-cookbook/book)
(Packt Publishing, Dec 2013) by [Scott Cranton](https://github.com/scranton) and [Jakub Korab](https://github.com/jkorab).
The latest version of this code is available on [GitHub](http://github.com/CamelCookbook/camel-cookbook-examples).

*This project is up to date with [Apache Camel 2.18.1](http://camel.apache.org/camel-2181-release.html).*

All of the examples are driven through JUnit tests, and are collectively structured as a set
of Apache Maven projects. To execute them, you will need a copy of the [Java 8 JDK]
(http://openjdk.java.net/install/) and an [Apache Maven 3](http://maven.apache.org/) installation. 
Maven will download all of the appropriate project dependencies.

In order to execute all the tests, all you need to do is run:

    $ mvn clean install

You will find the sample code laid out for the chapters as follows:

1. Structuring Routes - `camel-cookbook-structuring-routes`
2. Message Routing - `camel-cookbook-routing`
3. Routing to your Code - `camel-cookbook-extend`
4. Transformation - `camel-cookbook-transformation`
5. Splitting and Aggregating - `camel-cookbook-split-join`
6. Parallel Processing - `camel-cookbook-parallel-processing`
7. Error Handling and Compensation - `camel-cookbook-error`
8. Transactions and Idempotency - `camel-cookbook-transactions`
9. Testing - `camel-cookbook-testing`
10. Monitoring and Debugging - `camel-cookbook-monitoring`
11. Security - `camel-cookbook-security`
12. Web Services - `camel-cookbook-web-services`
