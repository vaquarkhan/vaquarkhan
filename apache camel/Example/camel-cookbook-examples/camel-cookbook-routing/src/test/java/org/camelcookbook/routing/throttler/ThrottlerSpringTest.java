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

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ThrottlerSpringTest extends CamelSpringTestSupport {
    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/throttler-context.xml");
    }

    @Test
    public void testThrottle() throws Exception {
        final int throttleRate = 5;
        final int messageCount = throttleRate + 2;

        getMockEndpoint("mock:unthrottled").expectedMessageCount(messageCount);
        getMockEndpoint("mock:throttled").expectedMessageCount(throttleRate);
        getMockEndpoint("mock:after").expectedMessageCount(throttleRate);

        for (int i = 0; i < messageCount; i++) {
            template.asyncSendBody("direct:start", "Camel Rocks");
        }

        // the test will stop once all of the conditions have been met
        // the only way this set of conditions can happen is if 2
        // messages are currently suspended for throttling
        assertMockEndpointsSatisfied();
    }
}
