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

package org.camelcookbook.routing.throttler;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class ThrottlerDynamicTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new ThrottlerDynamicRouteBuilder();
    }

    @Test
    public void testThrottleDynamic() throws Exception {
        final int throttleRate = 3;
        final int messageCount = throttleRate + 2;

        getMockEndpoint("mock:unthrottled").expectedMessageCount(messageCount);
        getMockEndpoint("mock:throttled").expectedMessageCount(throttleRate);
        getMockEndpoint("mock:after").expectedMessageCount(throttleRate);

        for (int i = 0; i < messageCount; i++) {
            Exchange exchange = getMandatoryEndpoint("direct:start").createExchange();
            {
                Message in = exchange.getIn();
                in.setHeader("throttleRate", throttleRate);
                in.setBody("Camel Rocks");
            }
            template.asyncSend("direct:start", exchange);
        }

        // the test will stop once all of the conditions have been met
        // the only way this set of conditions can happen is if 2
        // messages are currently suspended for throttling
        assertMockEndpointsSatisfied();
    }
}
