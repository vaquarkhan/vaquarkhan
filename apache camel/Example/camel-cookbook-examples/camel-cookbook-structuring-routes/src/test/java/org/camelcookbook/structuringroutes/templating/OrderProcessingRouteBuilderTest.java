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

package org.camelcookbook.structuringroutes.templating;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class OrderProcessingRouteBuilderTest extends CamelTestSupport {
    @Produce(uri = "direct:in")
    ProducerTemplate in;

    @EndpointInject(uri = "mock:out")
    MockEndpoint out;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        OrderFileNameProcessor orderFileNameProcessor = new OrderFileNameProcessor();
        orderFileNameProcessor.setCountryDateFormat("dd-MM-yyyy");

        OrderProcessingRouteBuilder routeBuilder = new OrderProcessingRouteBuilder();
        routeBuilder.setId("testOrders");
        routeBuilder.inputUri = "direct:in";
        routeBuilder.outputUri = "mock:out";
        routeBuilder.setOrderFileNameProcessor(orderFileNameProcessor);

        return routeBuilder;
    }

    @Test
    public void testRoutingLogic() throws InterruptedException {
        out.setExpectedMessageCount(1);
        out.message(0).body().startsWith("2013-11-23");
        out.message(0).header("CamelFileName").isEqualTo("2013-11-23.csv");

        in.sendBody("23-11-2013,1,Geology rocks t-shirt");

        assertMockEndpointsSatisfied();
    }
}
