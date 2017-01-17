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
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.transactions.utils.EmbeddedActiveMQBroker;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.junit.Rule;
import org.junit.Test;

/**
 * Demonstrates the use of local transacted behavior defined on a JMS endpoint.
 */
public class JmsTransactionEndpointTest extends CamelTestSupport {

    public static final int MAX_WAIT_TIME = 1000;

    @Rule
    public EmbeddedActiveMQBroker broker = new EmbeddedActiveMQBroker("embeddedBroker");

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new JmsTransactionEndpointRouteBuilder();
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        SimpleRegistry registry = new SimpleRegistry();

        ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory();
        connectionFactory.setBrokerURL(broker.getTcpConnectorUri());
        registry.put("connectionFactory", connectionFactory);

        CamelContext camelContext = new DefaultCamelContext(registry);
        ActiveMQComponent activeMQComponent = new ActiveMQComponent();
        activeMQComponent.setConnectionFactory(connectionFactory);
        camelContext.addComponent("jms", activeMQComponent);
        return camelContext;
    }

    @Test
    public void testTransactedExceptionThrown() throws InterruptedException {
        String message = "this message will explode";

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.whenAnyExchangeReceived(new ExceptionThrowingProcessor());

        // even though the route throws an exception, we don't have to deal with it here as we
        // don't send the message to the route directly, but to the broker, which acts as a middleman.
        template.sendBody("jms:inbound", message);

        // when transacted, ActiveMQ receives a failed signal when the exception is thrown
        // the message is placed into a dead letter queue
        assertEquals(message, consumer.receiveBody("jms:ActiveMQ.DLQ", MAX_WAIT_TIME, String.class));

        // the sending operation is performed in the same transaction, so it is rolled back
        assertNull(consumer.receiveBody("jms:outbound", MAX_WAIT_TIME, String.class));
    }
}
