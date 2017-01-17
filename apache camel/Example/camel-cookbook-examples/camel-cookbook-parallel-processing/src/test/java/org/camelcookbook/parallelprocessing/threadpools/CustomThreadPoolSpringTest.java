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

package org.camelcookbook.parallelprocessing.threadpools;

import java.util.List;

import org.apache.camel.Exchange;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Test class that exercises a custom thread pool using the threads DSL.
 */
public class CustomThreadPoolSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/threadPools-context.xml");
    }

    @Test
    public void testProcessedByCustomThreadPool() throws InterruptedException {
        final int messageCount = 50;

        final MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(messageCount);
        mockOut.setResultWaitTime(6000);

        for (int i = 0; i < messageCount; i++) {
            template.asyncSendBody("direct:in", "Message[" + i + "]");
        }

        assertMockEndpointsSatisfied();
        List<Exchange> receivedExchanges = mockOut.getReceivedExchanges();
        for (Exchange exchange : receivedExchanges) {
            assertTrue(exchange.getIn().getBody(String.class).endsWith("CustomThreadPool"));
        }
    }
}
