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

package org.camelcookbook.monitoring.logthroughput;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class LogThroughputTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new LogThroughputRouteBuilder();
    }

    @Test
    public void testLogThroughput() throws InterruptedException {
        final int messageCount = 20;

        getMockEndpoint("mock:result").expectedMessageCount(messageCount);

        for (int i = 0; i < messageCount; i++) {
            template.sendBody("direct:start", "Hello Camel " + i);
            Thread.sleep(100);
        }

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testLogThroughputInterval() throws InterruptedException {
        final int messageCount = 50;

        getMockEndpoint("mock:result").expectedMessageCount(messageCount);

        for (int i = 0; i < messageCount; i++) {
            template.sendBody("direct:startInterval", "Hello Camel " + i);
            Thread.sleep(100);
        }

        assertMockEndpointsSatisfied();
    }
}
