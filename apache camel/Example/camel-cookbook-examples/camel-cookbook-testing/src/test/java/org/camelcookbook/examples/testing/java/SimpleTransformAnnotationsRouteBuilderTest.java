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

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates the fundamental interactions going on to verify that a route behaves as it should.
 */
public class SimpleTransformAnnotationsRouteBuilderTest extends CamelTestSupport {

    @Produce(uri = "direct:in")
    private ProducerTemplate producerTemplate;

    @EndpointInject(uri = "mock:out")
    private MockEndpoint mockOut;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new SimpleTransformRouteBuilder();
    }

    @Test
    public void testPayloadIsTransformed() throws InterruptedException {
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo("Modified: Cheese");

        producerTemplate.sendBody("Cheese");

        assertMockEndpointsSatisfied();
    }
}
