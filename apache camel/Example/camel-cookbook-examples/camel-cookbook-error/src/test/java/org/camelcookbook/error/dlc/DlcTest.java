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

package org.camelcookbook.error.dlc;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class DlcTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new DlcRouteBuilder();
    }

    @Test
    public void testDlq() throws Exception {
        final MockEndpoint mockResult = getMockEndpoint("mock:result");
        mockResult.expectedMessageCount(1);
        mockResult.expectedBodiesReceived("Foo");
        mockResult.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNull();
        mockResult.message(0).header("myHeader").isEqualTo("changed");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedMessageCount(1);
        mockError.expectedBodiesReceived("KaBoom");
        mockError.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNotNull();
        mockError.message(0).exchangeProperty(Exchange.FAILURE_ROUTE_ID).isEqualTo("myDlcRoute");
        mockError.message(0).header("myHeader").isEqualTo("changed");

        template.sendBodyAndHeader("direct:start", "Foo", "myHeader", "original");
        template.sendBodyAndHeader("direct:start", "KaBoom", "myHeader", "original");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testDlqMultistep() throws Exception {
        final MockEndpoint mockResult = getMockEndpoint("mock:result");
        mockResult.expectedMessageCount(1);
        mockResult.expectedBodiesReceived("Foo");
        mockResult.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNull();
        mockResult.message(0).header("myHeader").isEqualTo("changed");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedMessageCount(1);
        mockError.expectedBodiesReceived("KaBoom");
        mockError.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNotNull();
        mockError.message(0).exchangeProperty(Exchange.FAILURE_ROUTE_ID).isEqualTo("myFlakyRoute");
        mockError.message(0).header("myHeader").isEqualTo("flaky");

        template.sendBodyAndHeader("direct:multiroute", "Foo", "myHeader", "original");
        template.sendBodyAndHeader("direct:multiroute", "KaBoom", "myHeader", "original");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testDlqMultistepOriginal() throws Exception {
        final MockEndpoint mockResult = getMockEndpoint("mock:result");
        mockResult.expectedMessageCount(1);
        mockResult.expectedBodiesReceived("Foo");
        mockResult.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNull();
        mockResult.message(0).header("myHeader").isEqualTo("changed");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedMessageCount(1);
        mockError.expectedBodiesReceived("KaBoom");
        mockError.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNotNull();
        mockError.message(0).exchangeProperty(Exchange.FAILURE_ROUTE_ID).isEqualTo("myFlakyRouteOriginal");
        mockError.message(0).header("myHeader").isEqualTo("multistep");

        template.sendBodyAndHeader("direct:multirouteOriginal", "Foo", "myHeader", "original");
        template.sendBodyAndHeader("direct:multirouteOriginal", "KaBoom", "myHeader", "original");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testDlqUseOriginal() throws Exception {
        final MockEndpoint mockResult = getMockEndpoint("mock:result");
        mockResult.expectedMessageCount(1);
        mockResult.expectedBodiesReceived("Foo");
        mockResult.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNull();
        mockResult.message(0).header("myHeader").isEqualTo("changed");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedMessageCount(1);
        mockError.expectedBodiesReceived("KaBoom");
        mockError.message(0).exchangeProperty(Exchange.EXCEPTION_CAUGHT).isNotNull();
        mockError.message(0).exchangeProperty(Exchange.FAILURE_ROUTE_ID).isEqualTo("myDlcOriginalRoute");
        mockError.message(0).header("myHeader").isEqualTo("original");

        template.sendBodyAndHeader("direct:useOriginal", "Foo", "myHeader", "original");
        template.sendBodyAndHeader("direct:useOriginal", "KaBoom", "myHeader", "original");

        assertMockEndpointsSatisfied();
    }
}
