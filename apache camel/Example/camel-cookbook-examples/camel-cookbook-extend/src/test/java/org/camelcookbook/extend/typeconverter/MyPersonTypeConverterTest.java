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

package org.camelcookbook.extend.typeconverter;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class MyPersonTypeConverterTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                onException(IllegalArgumentException.class)
                    .handled(true)
                    .to("mock:error")
                    .transform(constant("Malformed Person String"));

                from("direct:start")
                    .bean(MyPersonGreeter.class, "sayHello")
                    .to("mock:person");
            }
        };
    }

    @Test
    public void testConvertMyPerson() throws Exception {
        getMockEndpoint("mock:person").expectedBodiesReceived("Hello Scott Cranton");
        getMockEndpoint("mock:error").expectedMessageCount(0);

        template.sendBody("direct:start", "Scott|Cranton");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testConvertMyPersonFailure() throws Exception {
        getMockEndpoint("mock:person").expectedMessageCount(0);
        getMockEndpoint("mock:error").expectedMessageCount(1);

        template.sendBody("direct:start", "Invalid formatted string");

        assertMockEndpointsSatisfied();
    }
}
