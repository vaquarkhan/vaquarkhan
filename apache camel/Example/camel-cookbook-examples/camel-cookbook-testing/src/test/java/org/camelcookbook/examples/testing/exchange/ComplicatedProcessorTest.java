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

package org.camelcookbook.examples.testing.exchange;

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class ComplicatedProcessorTest extends CamelTestSupport {

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:in")
                    .process(new ComplicatedProcessor())
                    .to("mock:out");
            }
        };
    }

    @Test
    public void testPrepend() throws Exception {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.message(0).body().isEqualTo("SOMETHING text");
        mockOut.message(0).header("actionTaken").isEqualTo(true);

        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("action", "prepend");

        template.sendBodyAndHeaders("direct:in", "text", headers);

        assertMockEndpointsSatisfied();
    }
}
