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

package org.camelcookbook.splitjoin.splitreaggregate;

import java.io.FileInputStream;
import java.io.InputStream;
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
 * Demonstrates the splitting of a payload, processing of each of the fragments and reaggregating the results.
 */
public class SplitReaggregateSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/splitReaggregate-context.xml");
    }

    @Test
    public void testSplitAggregatesResponses() throws Exception {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.expectedMessageCount(2);

        String filename = "target/classes/xml/books-extended.xml";
        assertFileExists(filename);
        InputStream booksStream = new FileInputStream(filename);

        template.sendBody("direct:in", booksStream);

        assertMockEndpointsSatisfied();
        List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        assertBooksByCategory(receivedExchanges.get(0));
        assertBooksByCategory(receivedExchanges.get(1));
    }

    @Test
    public void testSplitAggregatesResponsesCombined() throws Exception {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.expectedMessageCount(2);

        String filename = "target/classes/xml/books-extended.xml";
        assertFileExists(filename);
        InputStream booksStream = new FileInputStream(filename);

        template.sendBody("direct:combined", booksStream);

        assertMockEndpointsSatisfied();
        List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        assertBooksByCategory(receivedExchanges.get(0));
        assertBooksByCategory(receivedExchanges.get(1));
    }

    private void assertBooksByCategory(Exchange exchange) {
        Message in = exchange.getIn();
        @SuppressWarnings("unchecked")
        Set<String> books = Collections.checkedSet(in.getBody(Set.class), String.class);
        String category = in.getHeader("category", String.class);
        switch (category) {
            case "Tech":
                assertTrue(books.containsAll(Collections.singletonList("Apache Camel Developer's Cookbook")));
                break;
            case "Cooking":
                assertTrue(books.containsAll(Arrays.asList("Camel Cookbook",
                    "Double decadence with extra cream", "Cooking with Butter")));
                break;
            default:
                fail();
                break;
        }
    }
}
