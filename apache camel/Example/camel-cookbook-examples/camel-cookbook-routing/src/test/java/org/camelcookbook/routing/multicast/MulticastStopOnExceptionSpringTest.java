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

package org.camelcookbook.routing.multicast;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MulticastStopOnExceptionSpringTest extends CamelSpringTestSupport {

    public static final String MESSAGE_BODY = "Message to be multicast";

    @Produce(uri = "direct:start")
    protected ProducerTemplate template;

    @EndpointInject(uri = "mock:first")
    private MockEndpoint mockFirst;

    @EndpointInject(uri = "mock:second")
    private MockEndpoint mockSecond;

    @EndpointInject(uri = "mock:afterMulticast")
    private MockEndpoint afterMulticast;

    @EndpointInject(uri = "mock:exceptionHandler")
    private MockEndpoint exceptionHandler;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/multicast-stopOnException-context.xml");
    }

    @Test
    public void testMessageRoutedToMulticastEndpoints() throws InterruptedException {
        mockFirst.setExpectedMessageCount(1);
        mockFirst.message(0).body().isEqualTo(MESSAGE_BODY);

        mockSecond.setExpectedMessageCount(0);

        afterMulticast.setExpectedMessageCount(0);
        exceptionHandler.setExpectedMessageCount(1);

        String response = (String) template.requestBody(MESSAGE_BODY);
        assertEquals("Oops", response);

        assertMockEndpointsSatisfied();
    }
}
