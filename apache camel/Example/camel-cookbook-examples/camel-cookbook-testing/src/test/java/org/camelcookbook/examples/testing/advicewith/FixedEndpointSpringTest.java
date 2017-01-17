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

package org.camelcookbook.examples.testing.advicewith;

import org.apache.camel.builder.AdviceWithRouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Test class that uses Camel's built-in AOP functionality to override the fixed endpoints.
 */
public class FixedEndpointSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/fixedEndpoints-context.xml");
    }

    @Override
    public boolean isUseAdviceWith() {
        return true;
    }

    @Test
    public void testOverriddenEndpoints() throws Exception {
        context.getRouteDefinition("modifyPayloadBetweenQueues")
            .adviceWith(context, new AdviceWithRouteBuilder() {
                @Override
                public void configure() throws Exception {
                    replaceFromWith("direct:in");

                    interceptSendToEndpoint("activemq:out")
                        .skipSendToOriginalEndpoint()
                        .to("mock:out");
                }
            });
        context.start();

        MockEndpoint out = getMockEndpoint("mock:out");
        out.setExpectedMessageCount(1);
        out.message(0).body().isEqualTo("Modified: Cheese");

        template.sendBody("direct:in", "Cheese");

        assertMockEndpointsSatisfied();
    }
}
