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
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * Test class that demonstrates the fundamental interactions going on to verify that a route behaves as it should.
 */
public class FirstPrinciplesRouteBuilderTest {
    private CamelContext camelContext;

    @Before
    public void setUpContext() throws Exception {
        this.camelContext = new DefaultCamelContext();
        camelContext.addRoutes(new SimpleTransformRouteBuilder());
        camelContext.start();
    }

    @After
    public void cleanUpContext() throws Exception {
        camelContext.stop();
    }

    @Test
    public void testPayloadIsTransformed() throws InterruptedException {
        MockEndpoint out = camelContext.getEndpoint("mock:out", MockEndpoint.class);

        out.setExpectedMessageCount(1);
        out.message(0).body().isEqualTo("Modified: Cheese");

        ProducerTemplate producerTemplate = camelContext.createProducerTemplate();
        producerTemplate.sendBody("direct:in", "Cheese");

        out.assertIsSatisfied();
    }
}
