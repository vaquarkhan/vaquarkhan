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

package org.camelcookbook.splitjoin.aggregateintervals;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates a aggregation using completion intervals.
 */
public class AggregateCompletionIntervalTest extends CamelTestSupport {

    @Override
    public RouteBuilder createRouteBuilder() {
        return new AggregateCompletionIntervalRouteBuilder();
    }

    @Test
    public void testAggregation() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setMinimumExpectedMessageCount(6);

        sendAndSleep("direct:in", "One", "group", "odd");
        sendAndSleep("direct:in", "Two", "group", "even");
        sendAndSleep("direct:in", "Three", "group", "odd");
        sendAndSleep("direct:in", "Four", "group", "even");
        sendAndSleep("direct:in", "Five", "group", "odd");
        sendAndSleep("direct:in", "Six", "group", "even");
        sendAndSleep("direct:in", "Seven", "group", "odd");
        sendAndSleep("direct:in", "Eight", "group", "even");
        sendAndSleep("direct:in", "Nine", "group", "odd");
        sendAndSleep("direct:in", "Ten", "group", "even");

        assertMockEndpointsSatisfied();
    }

    private void sendAndSleep(String endpointUri, String body, String headerName, String headerValue) throws InterruptedException {
        template.sendBodyAndHeader(endpointUri, body, headerName, headerValue);
        Thread.sleep(100);
    }
}
