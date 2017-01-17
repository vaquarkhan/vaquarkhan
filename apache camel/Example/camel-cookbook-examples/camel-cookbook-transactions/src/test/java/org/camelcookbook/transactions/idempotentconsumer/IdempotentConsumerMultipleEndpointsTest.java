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
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Tests that demonstrate the behavior of idempotent consumption.
 */
public class IdempotentConsumerMultipleEndpointsTest extends CamelTestSupport {

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new IdempotentConsumerMultipleEndpointsRouteBuilder();
    }

    @Test
    public void testReplayOfSameMessageWillNotTriggerCall() throws InterruptedException {
        MockEndpoint mockWs = getMockEndpoint("mock:ws");
        mockWs.setExpectedMessageCount(1);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(2);

        template.sendBodyAndHeader("direct:in", "Insert", "messageId", 1);
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
