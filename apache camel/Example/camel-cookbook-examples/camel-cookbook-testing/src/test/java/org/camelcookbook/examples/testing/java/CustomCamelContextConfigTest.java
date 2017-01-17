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

package org.camelcookbook.examples.testing.java;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.component.seda.SedaComponent;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates how a custom CamelContext can be configured for a test run.
 */
public class CustomCamelContextConfigTest extends CamelTestSupport {

    @Override
    public CamelContext createCamelContext() {
        CamelContext context = new DefaultCamelContext();
        // plug in a seda component, as we don't really need an embedded broker
        context.addComponent("activemq", new SedaComponent());
        return context;
    }

    @Override
    public RouteBuilder createRouteBuilder() {
        return new RouteBuilder() {
            @Override
            public void configure() {
                from("direct:in")
                    .to("activemq:orders");

                from("activemq:orders")
                    .to("mock:out");
            }
        };
    }

    @Test
    public void testMessagesFlowOverQueue() throws InterruptedException {
        MockEndpoint out = getMockEndpoint("mock:out");
        out.setExpectedMessageCount(1);
        out.expectedBodiesReceived("hello");

        template.sendBody("direct:in", "hello");

        assertMockEndpointsSatisfied();
    }
}
