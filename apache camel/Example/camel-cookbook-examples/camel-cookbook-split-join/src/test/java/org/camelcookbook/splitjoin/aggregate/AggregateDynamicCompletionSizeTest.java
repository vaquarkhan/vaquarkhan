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

package org.camelcookbook.splitjoin.aggregate;

import java.util.*;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates a use of a dynamic completion size with aggregation.
 */
public class AggregateDynamicCompletionSizeTest extends CamelTestSupport {

    @Override
    public RouteBuilder createRouteBuilder() {
        return new AggregateDynamicCompletionSizeRouteBuilder();
    }

    @Test
    public void testAggregation() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(2);

        Map<String, Object> oddHeaders = new HashMap<String, Object>();
        oddHeaders.put("group", "odd");
        oddHeaders.put("batchSize", "5");

        Map<String, Object> evenHeaders = new HashMap<String, Object>();
        evenHeaders.put("group", "even");
        evenHeaders.put("batchSize", "4");

        template.sendBodyAndHeaders("direct:in", "One", oddHeaders);
        template.sendBodyAndHeaders("direct:in", "Two", evenHeaders);
        template.sendBodyAndHeaders("direct:in", "Three", oddHeaders);
        template.sendBodyAndHeaders("direct:in", "Four", evenHeaders);
        template.sendBodyAndHeaders("direct:in", "Five", oddHeaders);
        template.sendBodyAndHeaders("direct:in", "Six", evenHeaders);
        template.sendBodyAndHeaders("direct:in", "Seven", oddHeaders);
        template.sendBodyAndHeaders("direct:in", "Eight", evenHeaders);
        template.sendBodyAndHeaders("direct:in", "Nine", oddHeaders);

        assertMockEndpointsSatisfied();

        List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        @SuppressWarnings("unchecked")
        Set<String> even = Collections.checkedSet(receivedExchanges.get(0).getIn().getBody(Set.class), String.class);
        assertTrue(even.containsAll(Arrays.asList("Two", "Four", "Six", "Eight")));

        @SuppressWarnings("unchecked")
        Set<String> odd = Collections.checkedSet(receivedExchanges.get(1).getIn().getBody(Set.class), String.class);
        assertTrue(odd.containsAll(Arrays.asList("One", "Three", "Five", "Seven", "Nine")));
    }
}
