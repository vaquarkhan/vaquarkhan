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

package org.camelcookbook.error.logging;

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class LoggingSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/logging-context.xml");
    }

    @Test
    public void testLoggingSpring() throws Exception {
        getMockEndpoint("mock:result").expectedMessageCount(1);

        try {
            template.sendBody("direct:start", "Foo");
        } catch (Throwable e) {
            fail("Shouldn't get here");
        }

        boolean threwException = false;
        try {
            template.sendBody("direct:start", "KaBoom");
        } catch (Throwable e) {
            threwException = true;
        }
        assertTrue(threwException);

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testLoggingRouteSpecificSpring() throws Exception {
        getMockEndpoint("mock:result").expectedMessageCount(1);

        try {
            template.sendBody("direct:routeSpecific", "Foo");
        } catch (Throwable e) {
            fail("Shouldn't get here");
        }

        boolean threwException = false;
        try {
            template.sendBody("direct:routeSpecific", "KaBoom");
        } catch (Throwable e) {
            threwException = true;
        }
        assertTrue(threwException);

        assertMockEndpointsSatisfied();
    }
}
