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

package org.camelcookbook.examples.testing.spring;

import java.util.Properties;

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Test class that demonstrates the fundamental interactions going on to verify that a route behaves as it should.
 */
public class SimpleTransformPropertiesInjectingSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext(
                "/spring/test-properties-context.xml",
                "/META-INF/spring/simpleTransform-context.xml");
    }

    @Override
    protected Boolean ignoreMissingLocationWithPropertiesComponent() {
        return true;
    }

    @Override
    protected Properties useOverridePropertiesWithPropertiesComponent() {
        Properties properties = new Properties();
        properties.setProperty("start.endpoint", "direct:in");
        properties.setProperty("end.endpoint", "mock:out");
        return properties;
    }

    @Test
    public void testPayloadIsTransformed() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo("Modified: Cheese");

        template.sendBody("direct:in", "Cheese");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testPayloadIsTransformedAgain() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo("Modified: Foo");

        template.sendBody("direct:in", "Foo");

        assertMockEndpointsSatisfied();
    }
}
