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

package org.camelcookbook.routing.multicast;

import org.apache.camel.EndpointInject;
import org.apache.camel.Exchange;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class MulticastParallelProcessingTest extends CamelTestSupport {

    public static final String MESSAGE_BODY = "Message to be multicast";

    @Produce(uri = "direct:start")
    protected ProducerTemplate template;

    @EndpointInject(uri = "mock:first")
    private MockEndpoint mockFirst;

    @EndpointInject(uri = "mock:second")
    private MockEndpoint mockSecond;

    @EndpointInject(uri = "mock:afterMulticast")
    private MockEndpoint afterMulticast;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new MulticastParallelProcessingRouteBuilder();
    }

    @Test
    public void testAllMessagesParticipateInDifferentTransactions() throws InterruptedException {
        afterMulticast.setExpectedMessageCount(1);
        mockFirst.setExpectedMessageCount(1);
        mockSecond.setExpectedMessageCount(1);

        template.sendBody(MESSAGE_BODY);

        assertMockEndpointsSatisfied();

        // check that all of the messages participated in different transactions
        assertNotEquals(getExchange(afterMulticast).getUnitOfWork(), getExchange(mockFirst).getUnitOfWork());
        assertNotEquals(getExchange(afterMulticast).getUnitOfWork(), getExchange(mockSecond).getUnitOfWork());
    }

    @Test
    public void testAllEndpointsReachedByDifferentThreads() throws InterruptedException {
        afterMulticast.setExpectedMessageCount(1);
        mockFirst.setExpectedMessageCount(1);
        mockSecond.setExpectedMessageCount(1);

        final String response = (String) template.requestBody(MESSAGE_BODY);
        assertEquals("response", response);

        assertMockEndpointsSatisfied();

        // check that all of the mock endpoints were reached by the different threads
        final String mainThreadName = getExchange(afterMulticast).getIn().getHeader("threadName", String.class);
        final String firstThreadName = getExchange(mockFirst).getIn().getHeader("threadName", String.class);
        final String secondThreadName = getExchange(mockSecond).getIn().getHeader("threadName", String.class);

        assertNotEquals(firstThreadName, mainThreadName);
        assertNotEquals(firstThreadName, secondThreadName);
        assertNotEquals(mainThreadName, secondThreadName);
    }

    private Exchange getExchange(MockEndpoint mock) {
        return mock.getExchanges().get(0);
    }
}
