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

import java.util.List;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.ThreadPoolProfileBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class ThrottlerAsyncDelayedTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        ThreadPoolProfileBuilder builder = new ThreadPoolProfileBuilder("myThrottler");
        builder.maxQueueSize(5);
        context.getExecutorServiceManager().registerThreadPoolProfile(builder.build());

        return new ThrottlerAsyncDelayedRouteBuilder();
    }

    @Override
    protected int getShutdownTimeout() {
        // tell CamelTestSupport to shutdown in 1 second versus default of 10
        // expect several in-flight messages that we don't care about
        return 1;
    }

    @Test
    public void testAsyncDelayedThrottle() throws Exception {
        final int throttleRate = 5;
        final int messageCount = throttleRate + 2;

        // here we are going to test that of 10 messages sent, the last 5
        // will have been throttled and processed on a different thread

        // let's wait until all of the messages have been processed
        MockEndpoint mockThrottled = getMockEndpoint("mock:throttled");
        mockThrottled.expectedMessageCount(messageCount);

        for (int i = 0; i < messageCount; i++) {
            template.asyncSendBody("direct:start", "Camel Rocks");
        }

        assertMockEndpointsSatisfied();

        List<Exchange> exchanges = mockThrottled.getExchanges();
        for (int i = 0; i < exchanges.size(); i++) {
            Exchange exchange = exchanges.get(i);
            String threadName = exchange.getIn().getHeader("threadName", String.class);
            if (i < throttleRate) {
                assertTrue(threadName.contains("ProducerTemplate"));
            } else {
                assertTrue(threadName.contains("Throttle"));
            }
        }
    }
}
