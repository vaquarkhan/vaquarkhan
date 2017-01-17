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

public class MulticastShallowCopyTest extends CamelTestSupport {

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
        return new MulticastShallowCopyRouteBuilder();
    }

    @Test
    public void testMessageRoutedToMulticastEndpoints() throws InterruptedException {
        mockFirst.setExpectedMessageCount(1);
        mockFirst.message(0).body().isEqualTo(MESSAGE_BODY);
        mockFirst.message(0).header("firstModifies").isEqualTo("apple");

        mockSecond.setExpectedMessageCount(1);
        mockSecond.message(0).body().isEqualTo(MESSAGE_BODY);
        mockSecond.message(0).header("secondModifies").isEqualTo("banana");
        mockSecond.message(0).header("firstModifies").isNull();

        afterMulticast.setExpectedMessageCount(1);
        afterMulticast.message(0).body().isEqualTo(MESSAGE_BODY);
        afterMulticast.message(0).header("modifiedBy").isNull();

        template.sendBody(MESSAGE_BODY);

        assertMockEndpointsSatisfied();
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
    public void testAllEndpointsReachedBySameThread() throws InterruptedException {
        afterMulticast.setExpectedMessageCount(1);
        mockFirst.setExpectedMessageCount(1);
        mockSecond.setExpectedMessageCount(1);

        template.sendBody(MESSAGE_BODY);

        assertMockEndpointsSatisfied();

        // check that all of the mock endpoints were reached by the same thread
        String firstThreadName = getExchange(mockFirst).getIn().getHeader("threadName", String.class);
        String secondThreadName = getExchange(mockSecond).getIn().getHeader("threadName", String.class);
        assertEquals(firstThreadName, secondThreadName);
    }

    private Exchange getExchange(MockEndpoint mock) {
        return mock.getExchanges().get(0);
    }

}
