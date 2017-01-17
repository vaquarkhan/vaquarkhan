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

package org.camelcookbook.structuringroutes.propertyplaceholder;

import org.apache.camel.EndpointInject;
import org.apache.camel.ExchangePattern;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class PropertyPlaceholderWithRouteBuilderSpringTest extends CamelSpringTestSupport {
    @EndpointInject(uri = "mock:out")
    private MockEndpoint out;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/propertyPlaceholder-routeBuilder-context.xml");
    }

    @Test
    public void testPropertiesLoaded() throws InterruptedException {
        final String messageBody = "Camel Rocks";
        final ExchangePattern callingMEP = ExchangePattern.InOnly;

        out.setExpectedMessageCount(1);
        out.message(0).body().isEqualTo("I hear you: Camel Rocks");

        // Explicitly set the Exchange Pattern
        template.sendBody("direct:in", messageBody);

        assertMockEndpointsSatisfied();
    }

}
