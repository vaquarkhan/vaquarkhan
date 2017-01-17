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

package org.camelcookbook.routing.loadbalancer;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class LoadBalancerStickySpringTest extends CamelSpringTestSupport {
    @Produce(uri = "direct:start")
    protected ProducerTemplate template;

    @EndpointInject(uri = "mock:first")
    private MockEndpoint first;

    @EndpointInject(uri = "mock:second")
    private MockEndpoint second;

    @EndpointInject(uri = "mock:third")
    private MockEndpoint third;

    @EndpointInject(uri = "mock:out")
    private MockEndpoint out;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/loadBalancer-sticky-context.xml");
    }

    @Test
    public void testMessageLoadBalancedToStickyEndpoints() throws InterruptedException {
        final String messageBody = "Client has bought something";

        first.setExpectedMessageCount(4);
        first.message(0).header("customerId").isEqualTo(0);
        first.message(1).header("customerId").isEqualTo(3);
        first.message(2).header("customerId").isEqualTo(0);
        first.message(3).header("customerId").isEqualTo(3);

        second.setExpectedMessageCount(2);
        second.message(0).header("customerId").isEqualTo(1);
        second.message(1).header("customerId").isEqualTo(1);

        third.setExpectedMessageCount(2);
        third.message(0).header("customerId").isEqualTo(2);
        third.message(1).header("customerId").isEqualTo(2);

        for (int messageCount = 0; messageCount < 2; messageCount++) {
            for (int customerCount = 0; customerCount < 4; customerCount++) {
                template.sendBodyAndHeader(messageBody, "customerId", customerCount);
            }
        }

        assertMockEndpointsSatisfied();
    }

}
