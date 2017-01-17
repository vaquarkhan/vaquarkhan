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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates a use of completion conditions with aggregation.
 */
public class AggregateCompletionConditionTest extends CamelTestSupport {

    @Override
    public RouteBuilder createRouteBuilder() {
        return new AggregateCompletionConditionRouteBuilder();
    }

    @Test
    public void testAggregation() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(2);

        template.sendBodyAndHeader("direct:in", "One", "group", "odd");
        template.sendBodyAndHeader("direct:in", "Two", "group", "even");
        template.sendBodyAndHeader("direct:in", "Three", "group", "odd");
        template.sendBodyAndHeader("direct:in", "Four", "group", "even");
        template.sendBodyAndHeader("direct:in", "Five", "group", "odd");
        template.sendBodyAndHeader("direct:in", "Six", "group", "even");
        template.sendBodyAndHeader("direct:in", "Seven", "group", "odd");
        template.sendBodyAndHeader("direct:in", "Eight", "group", "even");
        template.sendBodyAndHeader("direct:in", "Nine", "group", "odd");
        template.sendBodyAndHeader("direct:in", "Ten", "group", "even");

        assertMockEndpointsSatisfied();

        List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        @SuppressWarnings("unchecked")
        Set<String> odd = Collections.checkedSet(receivedExchanges.get(0).getIn().getBody(Set.class), String.class);
        assertTrue(odd.containsAll(Arrays.asList("One", "Three", "Five", "Seven", "Nine")));

        @SuppressWarnings("unchecked")
        Set<String> even = Collections.checkedSet(receivedExchanges.get(1).getIn().getBody(Set.class), String.class);
        assertTrue(even.containsAll(Arrays.asList("Two", "Four", "Six", "Eight", "Ten")));
    }
}
