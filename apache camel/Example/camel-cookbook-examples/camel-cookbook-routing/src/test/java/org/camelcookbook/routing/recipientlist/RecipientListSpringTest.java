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

package org.camelcookbook.routing.recipientlist;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class RecipientListSpringTest extends CamelSpringTestSupport {

    @Produce(uri = "direct:start")
    protected ProducerTemplate template;

    @EndpointInject(uri = "mock:order.priority")
    private MockEndpoint orderPriority;

    @EndpointInject(uri = "mock:order.normal")
    private MockEndpoint orderNormal;

    @EndpointInject(uri = "mock:billing")
    private MockEndpoint billing;

    @EndpointInject(uri = "mock:unrecognized")
    private MockEndpoint unrecognized;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/recipientList-context.xml");
    }

    @Test
    public void testNormalOrder() throws InterruptedException {
        String messageBody = "book";

        billing.setExpectedMessageCount(1);
        orderNormal.setExpectedMessageCount(1);
        orderPriority.setExpectedMessageCount(0);
        unrecognized.setExpectedMessageCount(0);

        template.sendBodyAndHeader(messageBody, "orderType", "normal");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testPriorityOrder() throws InterruptedException {
        String messageBody = "book";

        billing.setExpectedMessageCount(1);
        orderNormal.setExpectedMessageCount(0);
        orderPriority.setExpectedMessageCount(1);
        unrecognized.setExpectedMessageCount(0);

        template.sendBodyAndHeader(messageBody, "orderType", "priority");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testUnknownOrder() throws InterruptedException {
        String messageBody = "book";

        billing.setExpectedMessageCount(0);
        orderNormal.setExpectedMessageCount(0);
        orderPriority.setExpectedMessageCount(0);
        unrecognized.setExpectedMessageCount(1);

        template.sendBody(messageBody);

        assertMockEndpointsSatisfied();
    }
}
