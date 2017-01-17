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

package org.camelcookbook.splitjoin.aggregateparallel;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Test class that demonstrates a aggregation using timeouts with parallel processing of the results.
 *
 * @author jkorab
 */
public class AggregateExecutorServiceSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext(
            "/META-INF/spring/aggregateExecutorService-context.xml");
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

        final List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        final Message message1 = receivedExchanges.get(0).getIn();
        final Message message2 = receivedExchanges.get(1).getIn();

        log.info("exchange(0).header.group = {}", message1.getHeader("group"));
        log.info("exchange(0).property.CamelAggregatedCompletedBy = {}", message1.getExchange().getProperty("CamelAggregatedCompletedBy"));
        log.info("exchange(1).header.group = {}", message2.getHeader("group"));
        log.info("exchange(1).property.CamelAggregatedCompletedBy = {}", message2.getExchange().getProperty("CamelAggregatedCompletedBy"));

        final List<String> odd = Arrays.asList("One", "Three", "Five", "Seven", "Nine");
        final List<String> even = Arrays.asList("Two", "Four", "Six", "Eight", "Ten");

        @SuppressWarnings("unchecked")
        final Set<String> set1 = Collections.checkedSet(message1.getBody(Set.class), String.class);
        @SuppressWarnings("unchecked")
        final Set<String> set2 = Collections.checkedSet(message2.getBody(Set.class), String.class);

        if ("odd".equals(message1.getHeader("group"))) {
            assertTrue(set1.containsAll(odd));
            assertTrue(set2.containsAll(even));
        } else {
            assertTrue(set1.containsAll(even));
            assertTrue(set2.containsAll(odd));
        }
    }
}
