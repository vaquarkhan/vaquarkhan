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

package org.camelcookbook.examples.testing.mocks;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class ContentBasedRouterTest extends CamelTestSupport {

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new ContentBasedRouterRouteBuilder();
    }

    @Test
    public void testWhen() throws Exception {
        MockEndpoint mockCamel = getMockEndpoint("mock:camel");
        mockCamel.expectedMessageCount(2);
        mockCamel.message(0).body().isEqualTo("Camel Rocks");
        mockCamel.message(0).header("verified").isEqualTo(true);
        mockCamel.message(0).arrives().noLaterThan(50).millis().beforeNext();
        mockCamel.message(0).simple("${header[verified]} == true");

        MockEndpoint mockOther = getMockEndpoint("mock:other");
        mockOther.expectedMessageCount(0);

        template.sendBody("direct:start", "Camel Rocks");
        template.sendBody("direct:start", "Loving the Camel");

        mockCamel.assertIsSatisfied();
        mockOther.assertIsSatisfied();

        Exchange exchange0 = mockCamel.assertExchangeReceived(0);
        Exchange exchange1 = mockCamel.assertExchangeReceived(1);
        assertEquals(exchange0.getIn().getHeader("verified"), exchange1.getIn().getHeader("verified"));
    }

    @Test
    public void testOther() throws Exception {
        getMockEndpoint("mock:camel").expectedMessageCount(0);
        getMockEndpoint("mock:other").expectedMessageCount(1);

        template.sendBody("direct:start", "Hello World");

        // asserts that all the mock objects involved in this test are happy
        assertMockEndpointsSatisfied();
    }
}
