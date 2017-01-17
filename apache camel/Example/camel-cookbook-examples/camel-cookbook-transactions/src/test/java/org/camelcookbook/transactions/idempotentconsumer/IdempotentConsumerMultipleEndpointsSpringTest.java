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

package org.camelcookbook.transactions.idempotentconsumer;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Tests that demonstrate the behavior of idempotent consumption.
 */
public class IdempotentConsumerMultipleEndpointsSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/idempotentConsumerMultipleEndpoints-context.xml");
    }

    @Test
    public void testErrorWithinBlockWillEnableBlockReentry() throws InterruptedException {
        MockEndpoint mockWs = getMockEndpoint("mock:ws");
        mockWs.whenExchangeReceived(1, new Processor() {
            @Override
            public void process(Exchange exchange) throws Exception {
                throw new IllegalStateException("System is down");
            }
        });
        // the web service should be invoked twice
        // the IdempotentRepository should remove the fact that it has seen this message before
        mockWs.setExpectedMessageCount(2);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);

        try {
            template.sendBodyAndHeader("direct:in", "Insert", "messageId", 1);
            fail("No exception thrown");
        } catch (CamelExecutionException cee) {
            assertEquals("System is down", cee.getCause().getMessage());
        }
        template.sendBodyAndHeader("direct:in", "Insert", "messageId", 1); // again

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testErrorAfterBlockWillMeanBlockNotReentered() throws InterruptedException {
        MockEndpoint mockWs = getMockEndpoint("mock:ws");
        // the web service should be invoked once only
        mockWs.setExpectedMessageCount(1);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.whenExchangeReceived(1, new Processor() {
            @Override
            public void process(Exchange exchange) throws Exception {
                throw new IllegalStateException("Out system is down");
            }
        });
        mockOut.setExpectedMessageCount(2);

        try {
            template.sendBodyAndHeader("direct:in", "Insert", "messageId", 1);
            fail("No exception thrown");
        } catch (CamelExecutionException cee) {
            assertEquals("Out system is down", cee.getCause().getMessage());
        }
        template.sendBodyAndHeader("direct:in", "Insert", "messageId", 1); // again

        assertMockEndpointsSatisfied();
    }
}
