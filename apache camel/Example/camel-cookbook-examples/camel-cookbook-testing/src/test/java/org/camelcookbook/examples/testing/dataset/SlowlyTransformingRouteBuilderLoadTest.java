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

package org.camelcookbook.examples.testing.dataset;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.examples.testing.java.SlowlyTransformingRouteBuilder;
import org.junit.Test;

/**
 * Test class that demonstrates using the DataSet component to load test a route.
 */
public class SlowlyTransformingRouteBuilderLoadTest extends CamelTestSupport {
    @Override
    protected CamelContext createCamelContext() throws Exception {
        final int testBatchSize = 1000;

        InputDataSet inputDataSet = new InputDataSet();
        inputDataSet.setSize(testBatchSize);

        ExpectedOutputDataSet expectedOutputDataSet = new ExpectedOutputDataSet();
        expectedOutputDataSet.setSize(testBatchSize);

        SimpleRegistry registry = new SimpleRegistry();
        registry.put("input", inputDataSet);
        registry.put("expectedOutput", expectedOutputDataSet);

        return new DefaultCamelContext(registry);
    }

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        SlowlyTransformingRouteBuilder routeBuilder = new SlowlyTransformingRouteBuilder();
        routeBuilder.setSourceUri("dataset:input?produceDelay=-1");
        routeBuilder.setTargetUri("dataset:expectedOutput");
        return routeBuilder;
    }

    @Test
    public void testPayloadsTransformedInExpectedTime() throws InterruptedException {
        // A DataSetEndpoint is a sub-class of MockEndpoint that sets up expectations based on
        // the messages created, and the size property on the object.
        // All that is needed for us to test this route is to assert that the endpoint was satisfied.
        MockEndpoint expectedOutput = getMockEndpoint("dataset:expectedOutput");
        expectedOutput.setResultWaitTime(10000);
        expectedOutput.assertIsSatisfied();
    }
}
