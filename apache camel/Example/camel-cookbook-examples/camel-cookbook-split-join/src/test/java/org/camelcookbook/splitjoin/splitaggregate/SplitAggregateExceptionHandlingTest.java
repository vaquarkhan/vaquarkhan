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

package org.camelcookbook.splitjoin.splitaggregate;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Demonstrates the splitting of a payload, processing of each of the fragments and reaggregating the results.
 */
public class SplitAggregateExceptionHandlingTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new SplitAggregateExceptionHandlingRouteBuilder();
    }

    @Test
    public void testHandlesException() throws Exception {
        String[] array = new String[]{"one", "two", "three"};

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.expectedMessageCount(1);

        template.sendBody("direct:in", array);

        assertMockEndpointsSatisfied();
        Exchange exchange = mockOut.getReceivedExchanges().get(0);
        @SuppressWarnings("unchecked")
        Set<String> backendResponses = Collections.checkedSet(exchange.getIn().getBody(Set.class), String.class);
        assertTrue(backendResponses.containsAll(Arrays.asList("Processed: one", "Failed: two", "Processed: three")));
    }

}
