/*
 * Copyright (C) Scott Cranton and Jakub Korab
 * https://github.com/CamelCookbook
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.camelcookbook.transactions.jmstransaction;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.camel.component.ActiveMQComponent;
import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.spring.spi.SpringTransactionPolicy;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.junit.Test;
import org.springframework.jms.connection.JmsTransactionManager;

/**
 * Demonstrates the correct use of transactions with JMS when you need to perform a request-reply.
 */
public class JmsTransactionRequestReplyTest extends CamelTestSupport {

    public static final int MAX_WAIT_TIME = 4000;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new JmsTransactionRequestReplyRouteBuilder();
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        SimpleRegistry registry = new SimpleRegistry();
        ActiveMQConnectionFactory connectionFactory =
            new ActiveMQConnectionFactory("vm://embedded?broker.persistent=false");
        registry.put("connectionFactory", connectionFactory);

        JmsTransactionManager jmsTransactionManager = new JmsTransactionManager();
        jmsTransactionManager.setConnectionFactory(connectionFactory);
        registry.put("jmsTransactionManager", jmsTransactionManager);

        SpringTransactionPolicy propagationRequired = new SpringTransactionPolicy();
        propagationRequired.setTransactionManager(jmsTransactionManager);
        propagationRequired.setPropagationBehaviorName("PROPAGATION_REQUIRED");
        registry.put("PROPAGATION_REQUIRED", propagationRequired);

        SpringTransactionPolicy propagationNotSupported = new SpringTransactionPolicy();
        propagationNotSupported.setTransactionManager(jmsTransactionManager);
        propagationNotSupported.setPropagationBehaviorName("PROPAGATION_NOT_SUPPORTED");
        registry.put("PROPAGATION_NOT_SUPPORTED", propagationNotSupported);

        CamelContext camelContext = new DefaultCamelContext(registry);

        ActiveMQComponent activeMQComponent = new ActiveMQComponent();
        activeMQComponent.setConnectionFactory(connectionFactory);
        activeMQComponent.setTransactionManager(jmsTransactionManager);
        camelContext.addComponent("jms", activeMQComponent);

        return camelContext;
    }

    @Test
    public void testTransactedNoExceptionThrown() throws InterruptedException {
        String message = "this message is OK";

        // the request should be received by the backend
        MockEndpoint mockBackEndReply = getMockEndpoint("mock:backEndReply");
        mockBackEndReply.setExpectedMessageCount(1);

        String backendReply = "Backend processed: this message is OK";
        mockBackEndReply.message(0).body().isEqualTo(backendReply);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo(backendReply);

        template.sendBody("jms:inbound", message);

        assertMockEndpointsSatisfied();

        assertNull(consumer.receiveBody("jms:ActiveMQ.DLQ", MAX_WAIT_TIME, String.class));
        assertEquals(message, consumer.receiveBody("jms:auditQueue", MAX_WAIT_TIME, String.class));
    }

    @Test
    public void testTransactedExceptionThrown() throws InterruptedException {
        String message = "this message will explode";

        // the back-end executed; it's status will be unaffected by the rollback
        MockEndpoint mockBackEndReply = getMockEndpoint("mock:backEndReply");
        mockBackEndReply.setExpectedMessageCount(1);

        String backendReply = "Backend processed: this message will explode";
        mockBackEndReply.message(0).body().isEqualTo(backendReply);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);
        mockOut.whenAnyExchangeReceived(new ExceptionThrowingProcessor());

        template.sendBody("jms:inbound", message);

        // when transacted, ActiveMQ receives a failed signal when the exception is thrown
        // the message is placed into a dead letter queue
        final String dlqMessage = consumer.receiveBody("jms:ActiveMQ.DLQ", MAX_WAIT_TIME, String.class);
        assertNotNull("Timed out waiting for DLQ message", dlqMessage);
        log.info("dlq message = {}", dlqMessage);
        assertEquals(message, dlqMessage);
        assertNull(consumer.receiveBody("jms:auditQueue", MAX_WAIT_TIME, String.class));
    }
}
