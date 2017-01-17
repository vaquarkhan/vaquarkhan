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
 * Demonstrates the use of a transaction policy over a JMS component.
 */
public class JmsTransactionPolicyTxAllSpringTest extends CamelSpringTestSupport {

    public static final int MAX_WAIT_TIME = 1000;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/jmsTransaction-context.xml");
    }

    @Test
    public void testTransactedExceptionThrown() throws InterruptedException {
        String message = "this message will explode";

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.whenAnyExchangeReceived(new ExceptionThrowingProcessor());

        // even though the route throws an exception, we don't have to deal with it here as we
        // don't send the message to the route directly, but to the broker, which acts as a middleman.
        template.sendBody("jms:inbound", message);

        // because a transaction manager was running over the connection factory, the receive is transacted
        // even though the policy does not wrap the consumer endpoint

        // when transacted, ActiveMQ receives a failed signal when the exception is thrown
        // the message is placed into a dead letter queue
        assertEquals(message, consumer.receiveBody("jms:ActiveMQ.DLQ", MAX_WAIT_TIME, String.class));

        // because the sending was performed in a transaction, it is rolled back
        assertNull(consumer.receiveBody("jms:outbound", MAX_WAIT_TIME, String.class));
    }
}