/**
  * Copyright 2012 FuseSource
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
package com.fusesource.example.camel.process.camel;

import static junit.framework.Assert.assertTrue;

import java.sql.SQLException;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import javax.xml.datatype.DatatypeFactory;

import org.apache.camel.EndpointInject;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.AdviceWithRouteBuilder;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.model.ModelCamelContext;
import org.apache.camel.model.RouteDefinition;
import org.apache.camel.model.dataformat.JaxbDataFormat;
import org.apache.camel.spring.SpringCamelContext;
import org.example.model.ObjectFactory;
import org.example.model.RecordType;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fusesource.example.camel.logic.NonRecoverableExternalServiceException;
import com.fusesource.example.camel.logic.RecoverableExternalServiceException;
import com.fusesource.example.camel.model.Record;
import com.fusesource.example.camel.process.camel.ProcessorRouteBuilder;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration
public class ProcessorRouteBuilderTest {

    @Autowired
    private ProcessorRouteBuilder builder;

    @EndpointInject(uri = "mock:output")
    private MockEndpoint output;

    @EndpointInject(uri = "mock:dlq")
    private MockEndpoint dlq;

    @Produce(uri = "direct:trigger")
    private ProducerTemplate trigger;

    @Autowired
    private ModelCamelContext context;
    
    /**
     * Stop Camel from starting when Spring boots up.  We do this as it
     * is 1) quicker when using adviceWith and 2) because it is required
     * when using certain advice features.
     */
    @BeforeClass
    public static void stopCamelStart() {
        SpringCamelContext.setNoStart(true);
    }
    
    /**
     * Re-enable Camel startup with Spring.
     */
    @AfterClass
    public static void enableCamelStart() {
        SpringCamelContext.setNoStart(false);
    }

    @Before
    public void setup() throws Exception {
        
        if (context.getRoute("testRoute") == null) {
            final JaxbDataFormat jbdf = new JaxbDataFormat();
            jbdf.setContextPath(ObjectFactory.class.getPackage().getName());
            
            // Forward requests to the JMS endpoint and monitor the DLQ.
            context.addRoutes(new RouteBuilder() {
                @Override
                public void configure() throws Exception {
                    from("direct:trigger")
                        .routeId("testRoute")
                        .process(new Processor() {
                            @Override
                            public void process(Exchange exchange)
                                    throws Exception {
                                ObjectFactory objFact = new ObjectFactory();

                                RecordType record = exchange.getIn().getBody(
                                        RecordType.class);
                                exchange.getIn().setBody(
                                        objFact.createRecord(record));
                            }
                        })
                        .marshal(jbdf)
                        // Change ack mode since we don't want Tx with the send
                        .to("activemq:queue:" + builder.getRecordsQueueName()
                                + "?acknowledgementModeName=AUTO_ACKNOWLEDGE");

                    from("activemq:ActiveMQ.DLQ").to("mock:dlq");
                }
            });        
        }
    }
    
    @After
    public void teardown() throws Exception {
        output.reset();
        dlq.reset();
    }

    @Test
    @DirtiesContext
    public void testPositive() throws Exception {
        context.start();

        DatatypeFactory dtf = DatatypeFactory.newInstance();

        Set<String> expectedIds = new HashSet<String>();

        output.setExpectedMessageCount(10);
        output.setResultWaitTime(12000l);

        for (int i = 0; i < 10; i++) {
            RecordType recordType = new RecordType();
            recordType.setId(String.valueOf(i));
            recordType.setDate(dtf.newXMLGregorianCalendar(new GregorianCalendar()));
            recordType.setDescription("Record number: " + i);
            expectedIds.add(String.valueOf(i));

            trigger.sendBody(recordType);
        }

        output.assertIsSatisfied();

        for (Exchange exchange : output.getReceivedExchanges()) {
            assertTrue(expectedIds.remove(exchange.getIn()
                    .getBody(Record.class).getId()));
        }

        assertTrue(expectedIds.isEmpty());
    }
    
    @Test
    @DirtiesContext
    public void testDuplicates() throws Exception {
        context.start();
        
        DatatypeFactory dtf = DatatypeFactory.newInstance();

        output.setExpectedMessageCount(1);

        RecordType recordType = new RecordType();
        recordType.setId("1");
        recordType.setDate(dtf.newXMLGregorianCalendar(new GregorianCalendar()));
        recordType.setDescription("Record number: 1");

        trigger.sendBody(recordType);
        
        trigger.sendBody(recordType);

        output.assertIsSatisfied();
    }

    @Test
    @DirtiesContext
    public void testTerminalJdbcFailure() throws Exception {

        configureJdbcFailure(3);
        
        context.start();

        DatatypeFactory dtf = DatatypeFactory.newInstance();

        Set<String> expectedIds = new HashSet<String>();

        output.setExpectedMessageCount(9);
        output.setResultWaitTime(12000l);

        dlq.setExpectedMessageCount(1);

        for (int i = 0; i < 10; i++) {
            RecordType recordType = new RecordType();
            recordType.setId(String.valueOf(i));
            recordType.setDate(dtf.newXMLGregorianCalendar(new GregorianCalendar()));
            recordType.setDescription("Record number: " + i);

            if (i != 1) {
                expectedIds.add(String.valueOf(i));
            }

            trigger.sendBody(recordType);
        }

        output.assertIsSatisfied();
        dlq.assertIsSatisfied();

        for (Exchange exchange : output.getReceivedExchanges()) {
            assertTrue(expectedIds.remove(exchange.getIn()
                    .getBody(Record.class).getId()));
        }

        assertTrue(expectedIds.isEmpty());

        assertTrue(dlq.getReceivedExchanges().get(0).getIn()
                .getBody(String.class).contains("id>1</"));
    }

    @Test
    @DirtiesContext
    public void testNonTerminalJdbcFailure() throws Exception {

        configureJdbcFailure(1);
        
        context.start();

        DatatypeFactory dtf = DatatypeFactory.newInstance();

        Set<String> expectedIds = new HashSet<String>();

        output.setExpectedMessageCount(10);
        output.setResultWaitTime(15000l);

        dlq.setExpectedMessageCount(0);

        for (int i = 0; i < 10; i++) {
            RecordType recordType = new RecordType();
            recordType.setId(String.valueOf(i));
            recordType.setDate(dtf
                    .newXMLGregorianCalendar(new GregorianCalendar()));
            recordType.setDescription("Record number: " + i);
            expectedIds.add(String.valueOf(i));

            trigger.sendBody(recordType);
        }

        output.assertIsSatisfied();
        dlq.assertIsSatisfied(10000);

        for (Exchange exchange : output.getReceivedExchanges()) {
            assertTrue(expectedIds.remove(exchange.getIn()
                    .getBody(Record.class).getId()));
        }

        assertTrue(expectedIds.isEmpty());
    }

    @Test
    @DirtiesContext
    public void testRecoverableExternalServiceException() throws Exception {
        configureProcessRecordFailure(3, true);
        
        context.start();
        
        DatatypeFactory dtf = DatatypeFactory.newInstance();

        output.setExpectedMessageCount(1);

        dlq.setExpectedMessageCount(0);

        RecordType recordType = new RecordType();
        recordType.setId("1");
        recordType.setDate(dtf
                .newXMLGregorianCalendar(new GregorianCalendar()));
        recordType.setDescription("Record number: 1");

        trigger.sendBody(recordType);
        
        output.assertIsSatisfied();
        dlq.assertIsSatisfied(10000);
    }
    
    @Test
    @DirtiesContext
    public void testNonRecoverableExternalServiceException() throws Exception {
        configureProcessRecordFailure(1, false);
        
        context.start();
        
        DatatypeFactory dtf = DatatypeFactory.newInstance();

        output.setExpectedMessageCount(0);
        dlq.setExpectedMessageCount(1);

        RecordType recordType = new RecordType();
        recordType.setId("1");
        recordType.setDate(dtf
                .newXMLGregorianCalendar(new GregorianCalendar()));
        recordType.setDescription("Record number: 1");

        trigger.sendBody(recordType);
        
        output.assertIsSatisfied(1000);
        dlq.assertIsSatisfied();
    }

    protected void configureJdbcFailure(final int failureCount)
            throws Exception {
        RouteDefinition routeDef = context
                .getRouteDefinition(ProcessorRouteBuilder.PERSIST_RECORD_ROUTE_ID);

        routeDef.adviceWith(context, new AdviceWithRouteBuilder() {

            private AtomicInteger count = new AtomicInteger(0);

            @Override
            public void configure() throws Exception {
                interceptSendToEndpoint(
                        builder.getAlternatePersistEndpointUri()).process(
                        new Processor() {

                            @Override
                            public void process(Exchange exchange)
                                    throws Exception {
                                Record record = exchange.getIn().getBody(Record.class);

                                if ("1".equals(record.getId())
                                        && count.getAndIncrement() < failureCount) {
                                    throw new SQLException("Simulated JDBC Error!");
                                }
                            }
                        });
            }
        });
    }

    protected void configureProcessRecordFailure(final int failureCount, 
            final boolean recoverableFailure) throws Exception {
        RouteDefinition routeDef = context
                .getRouteDefinition(ProcessorRouteBuilder.PROCESS_RECORD_ROUTE_ID);

        routeDef.adviceWith(context, new AdviceWithRouteBuilder() {

            private AtomicInteger count = new AtomicInteger(0);

            @Override
            public void configure() throws Exception {
                interceptSendToEndpoint(
                        "bean:recordProcessor?method=processRecord").process(
                        new Processor() {

                            @Override
                            public void process(Exchange exchange) throws Exception {
                                Record record = exchange.getIn().getBody(Record.class);

                                if ("1".equals(record.getId())
                                        && count.getAndIncrement() < failureCount) {
                                    if (recoverableFailure) {
                                        throw new RecoverableExternalServiceException(
                                                "Simulated Processor Error!");
                                    } else {
                                        throw new NonRecoverableExternalServiceException(
                                                "Simulated Processor Error!");
                                    }
                                }
                            }
                        });
            }
        });
    }
}
