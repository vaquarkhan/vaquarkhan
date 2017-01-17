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

package org.camelcookbook.structuringroutes.direct;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class DirectTest extends CamelTestSupport {
    @Produce(uri = "direct:A")
    ProducerTemplate in;

    @EndpointInject(uri = "mock:endA")
    MockEndpoint endA;

    @EndpointInject(uri = "mock:endB")
    MockEndpoint endB;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new DirectRouteBuilder();
    }

    @Test
    public void testInOutMessage() throws Exception {
        String message = "hello";

        String expectedResponse = "A2[ B[ A1[ hello ] ] ]";
        endB.setExpectedMessageCount(1);
        endA.setExpectedMessageCount(1);
        endA.message(0).body().isEqualTo(expectedResponse);

        String response = (String) in.requestBody(message);
        assertEquals(expectedResponse, response);
        assertMockEndpointsSatisfied();
    }

    @Test
    public void testInOnlyMessage() throws Exception {
        String message = "hello";

        String expectedResponse = "A2[ B[ A1[ hello ] ] ]";
        endB.setExpectedMessageCount(1);
        endA.setExpectedMessageCount(1);

        in.sendBody(message);
        assertMockEndpointsSatisfied();
    }

}
