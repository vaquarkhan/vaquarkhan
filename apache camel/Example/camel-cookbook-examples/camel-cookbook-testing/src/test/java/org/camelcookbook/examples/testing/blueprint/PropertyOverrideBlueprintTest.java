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

package org.camelcookbook.examples.testing.blueprint;

import java.util.Dictionary;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.blueprint.CamelBlueprintTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates overriding properties in a Blueprint environment.
 */
public class PropertyOverrideBlueprintTest extends CamelBlueprintTestSupport {

    @Produce(uri = "direct:in")
    private ProducerTemplate producerTemplate;

    @EndpointInject(uri = "mock:out")
    private MockEndpoint mockOut;

    @Override
    protected String getBlueprintDescriptor() {
        return "/OSGI-INF/blueprint/simpleTransform-context.xml," +
               "/OSGI-INF/blueprint/simpleTransform-properties-context.xml";
    }

    @Override
    protected String useOverridePropertiesWithConfigAdmin(Dictionary props) throws Exception {
        props.put("transform.message", "Overridden");
        return "org.camelcookbook.testing";
    }

    @Test
    public void testPayloadIsTransformed() throws InterruptedException {
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo("Overridden: Cheese");

        producerTemplate.sendBody("Cheese");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testPayloadIsTransformedAgain() throws InterruptedException {
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo("Overridden: Foo");

        producerTemplate.sendBody("Foo");

        assertMockEndpointsSatisfied();
    }
}
