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

package org.camelcookbook.parallelprocessing.threadpools;

import java.util.List;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that exercises a custom thread pool using the threads DSL, using the routeBuilder() option in a
 * RouteBuilder.
 */
public class CustomThreadPoolInlineTest extends CamelTestSupport {

    @Override
    public RouteBuilder createRouteBuilder() {
        return new CustomThreadPoolInlineRouteBuilder();
    }

    @Test
    public void testProcessedByCustomThreadPool() throws InterruptedException {
        final int messageCount = 50;

        final MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(messageCount);
        mockOut.setResultWaitTime(6000);

        for (int i = 0; i < messageCount; i++) {
            template.asyncSendBody("direct:in", "Message[" + i + "]");
        }

        assertMockEndpointsSatisfied();
        List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        for (Exchange exchange : receivedExchanges) {
            assertTrue(exchange.getIn().getBody(String.class).endsWith("CustomThreadPool"));
        }
    }
}
