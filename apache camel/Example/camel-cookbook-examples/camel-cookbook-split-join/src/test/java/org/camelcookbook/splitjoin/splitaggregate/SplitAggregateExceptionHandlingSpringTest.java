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
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the handling of an exception during splitting and aggregation.
 */
public class SplitAggregateExceptionHandlingSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/splitAggregateExceptionHandling-context.xml");
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
