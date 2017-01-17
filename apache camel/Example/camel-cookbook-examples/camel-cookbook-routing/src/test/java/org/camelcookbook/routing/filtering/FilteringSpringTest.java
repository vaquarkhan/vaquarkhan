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

package org.camelcookbook.routing.filtering;

import org.apache.camel.Exchange;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class FilteringSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/filtering-context.xml");
    }

    @Test
    public void testFirstFilter() throws Exception {
        final MockEndpoint mockEndpointC = getMockEndpoint("mock:C");
        mockEndpointC.expectedMessageCount(1);
        mockEndpointC.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        final MockEndpoint mockEndpointAfterC = getMockEndpoint("mock:afterC");
        mockEndpointAfterC.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointAfterC.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        getMockEndpoint("mock:amel").expectedMessageCount(0);

        final MockEndpoint mockEndpointOther = getMockEndpoint("mock:other");
        mockEndpointOther.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointOther.expectedPropertyReceived(Exchange.FILTER_MATCHED, false);

        template.sendBody("direct:start", "Cooks Rocks");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testSecondFilter() throws Exception {
        getMockEndpoint("mock:C").expectedMessageCount(0);

        final MockEndpoint mockEndpointAfterC = getMockEndpoint("mock:afterC");
        mockEndpointAfterC.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointAfterC.expectedPropertyReceived(Exchange.FILTER_MATCHED, false);

        final MockEndpoint mockEndpointAmel = getMockEndpoint("mock:amel");
        mockEndpointAmel.expectedMessageCount(1);
        mockEndpointAmel.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        final MockEndpoint mockEndpointOther = getMockEndpoint("mock:other");
        mockEndpointOther.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointOther.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        template.sendBody("direct:start", "amel is in Belgium");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testBothFilter() throws Exception {
        final MockEndpoint mockEndpointC = getMockEndpoint("mock:C");
        mockEndpointC.expectedMessageCount(1);
        mockEndpointC.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        final MockEndpoint mockEntpointAfterC = getMockEndpoint("mock:afterC");
        mockEntpointAfterC.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEntpointAfterC.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        final MockEndpoint mockEndpointAmel = getMockEndpoint("mock:amel");
        mockEndpointAmel.expectedMessageCount(1);
        mockEndpointAmel.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        final MockEndpoint mockEndpointOther = getMockEndpoint("mock:other");
        mockEndpointOther.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointOther.expectedPropertyReceived(Exchange.FILTER_MATCHED, true);

        template.sendBody("direct:start", "Camel Rocks!");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOther() throws Exception {
        getMockEndpoint("mock:C").expectedMessageCount(0);

        final MockEndpoint mockEndpointAfterC = getMockEndpoint("mock:afterC");
        mockEndpointAfterC.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointAfterC.expectedPropertyReceived(Exchange.FILTER_MATCHED, false);

        getMockEndpoint("mock:amel").expectedMessageCount(0);

        final MockEndpoint mockEndpointOther = getMockEndpoint("mock:other");
        mockEndpointOther.expectedMessageCount(1);

        // FILTER_MATCHED set to true if message matched previous Filter Predicate
        mockEndpointOther.expectedPropertyReceived(Exchange.FILTER_MATCHED, false);

        template.sendBody("direct:start", "Hello World");

        assertMockEndpointsSatisfied();
    }
}
