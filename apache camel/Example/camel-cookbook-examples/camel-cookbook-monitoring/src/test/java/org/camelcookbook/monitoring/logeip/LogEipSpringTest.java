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

package org.camelcookbook.monitoring.logeip;

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class LogEipSpringTest extends CamelSpringTestSupport {
    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/logeip-context.xml");
    }

    @Test
    public void testLogEipSpring() throws InterruptedException {
        getMockEndpoint("mock:result").expectedMessageCount(1);

        template.sendBody("direct:start", "Hello Camel");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testLogEipLevelSpring() throws InterruptedException {
        getMockEndpoint("mock:result").expectedMessageCount(1);

        template.sendBody("direct:startLevel", "Hello Camel");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testLogEipNameSpring() throws InterruptedException {
        getMockEndpoint("mock:result").expectedMessageCount(1);

        template.sendBody("direct:startName", "Hello Camel");

        assertMockEndpointsSatisfied();
    }
}
