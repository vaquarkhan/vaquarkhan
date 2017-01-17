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

package org.camelcookbook.error.retry;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class RetryTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new RetryRouteBuilder();
    }

    @Test
    public void testRetry() throws Exception {
        final MockEndpoint mockEndpoint = getMockEndpoint("mock:result");
        mockEndpoint.expectedMessageCount(1);
        mockEndpoint.allMessages().header(Exchange.REDELIVERED).isEqualTo(true);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_COUNTER).isEqualTo(1);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_MAX_COUNTER).isEqualTo(2);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_DELAY).isNull();

        template.sendBody("direct:start", "Foo");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testRetryRouteSpecific() throws Exception {
        final MockEndpoint mockEndpoint = getMockEndpoint("mock:result");
        mockEndpoint.expectedMessageCount(1);
        mockEndpoint.allMessages().header(Exchange.REDELIVERED).isEqualTo(true);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_COUNTER).isEqualTo(1);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_MAX_COUNTER).isEqualTo(2);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_DELAY).isNull();

        template.sendBody("direct:routeSpecific", "Foo");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testRetryRouteSpecificDelay() throws Exception {
        final MockEndpoint mockEndpoint = getMockEndpoint("mock:result");
        mockEndpoint.expectedMessageCount(1);
        mockEndpoint.allMessages().header(Exchange.REDELIVERED).isEqualTo(true);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_COUNTER).isEqualTo(1);
        mockEndpoint.allMessages().header(Exchange.REDELIVERY_MAX_COUNTER).isEqualTo(2);
        mockEndpoint.allMessages().exchangeProperty("SporadicDelay").isGreaterThanOrEqualTo(500);

        template.sendBody("direct:routeSpecificDelay", "Foo");

        log.info("delay = {}", mockEndpoint.getReceivedExchanges().get(0).getProperty("SporadicDelay", long.class));

        assertMockEndpointsSatisfied();
    }
}
