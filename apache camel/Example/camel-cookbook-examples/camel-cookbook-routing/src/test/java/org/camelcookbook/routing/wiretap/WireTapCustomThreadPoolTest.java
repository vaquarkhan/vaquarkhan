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

package org.camelcookbook.routing.wiretap;

import java.util.List;

import org.apache.camel.*;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Assert;
import org.junit.Test;

public class WireTapCustomThreadPoolTest extends CamelTestSupport {

    @Produce(uri = "direct:start")
    protected ProducerTemplate template;

    @EndpointInject(uri = "mock:tapped")
    private MockEndpoint tapped;

    @EndpointInject(uri = "mock:out")
    private MockEndpoint out;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new WireTapCustomThreadPoolRouteBuilder();
    }

    @Test
    public void testMessageWireTappedInOrderBySameThread() throws InterruptedException {
        final String messageBody = "Message to be tapped";
        final int messagesToSend = 3;

        tapped.setExpectedMessageCount(messagesToSend);
        tapped.expectsAscending().header("messageCount");

        out.setExpectedMessageCount(messagesToSend);
        out.expectsAscending().header("messageCount");

        for (int messageCount = 0; messageCount < messagesToSend; messageCount++) {
            template.sendBodyAndHeader(messageBody, "messageCount", messageCount);
        }

        assertMockEndpointsSatisfied();

        List<Exchange> exchanges = tapped.getExchanges();
        String firstExchangeThreadName = null;
        for (Exchange exchange : exchanges) {
            Message in = exchange.getIn();
            if (firstExchangeThreadName == null) {
                firstExchangeThreadName = in.getHeader("threadName", String.class);
            }
            Assert.assertEquals(firstExchangeThreadName, in.getHeader("threadName", String.class));
        }
    }
}
