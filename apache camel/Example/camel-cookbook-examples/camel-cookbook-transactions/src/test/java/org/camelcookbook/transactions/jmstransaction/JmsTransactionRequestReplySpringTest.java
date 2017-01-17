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

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the correct use of transactions with JMS when you need to perform a request-reply.
 */
public class JmsTransactionRequestReplySpringTest extends CamelSpringTestSupport {

    public static final int MAX_WAIT_TIME = 4000;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/jmsTransactionRequestReply-context.xml");
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
