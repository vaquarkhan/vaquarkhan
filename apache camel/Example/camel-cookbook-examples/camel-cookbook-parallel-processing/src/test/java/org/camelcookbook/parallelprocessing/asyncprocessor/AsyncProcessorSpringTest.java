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

package org.camelcookbook.parallelprocessing.asyncprocessor;

import org.apache.camel.ExchangePattern;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Test class that demonstrates the behavior of an {@link org.apache.camel.AsyncProcessor}.
 */
public class AsyncProcessorSpringTest extends CamelSpringTestSupport {
    final int messageCount = 10;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/asyncProcessor-context.xml");
    }

    @Test
    public void testAsyncProcessing() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(messageCount);
        mockOut.setResultWaitTime(5000);

        for (int i = 0; i < messageCount; i++) {
            template.sendBody("seda:in", ExchangePattern.InOnly, "Message[" + i + "]");
        }

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testSyncProcessing() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(messageCount);
        mockOut.setResultWaitTime(5000);

        for (int i = 0; i < messageCount; i++) {
            template.sendBody("direct:sync", ExchangePattern.InOnly, "Message[" + i + "]");
        }

        assertMockEndpointsSatisfied();
    }
}
