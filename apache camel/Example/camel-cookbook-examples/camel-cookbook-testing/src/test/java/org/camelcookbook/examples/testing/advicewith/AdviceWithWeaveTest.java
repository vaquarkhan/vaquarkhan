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

package org.camelcookbook.examples.testing.advicewith;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.AdviceWithRouteBuilder;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class AdviceWithWeaveTest extends CamelTestSupport {

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:in").id("slowRoute")
                    .process(new Processor() {
                        @Override
                        public void process(Exchange exchange) throws Exception {
                            Thread.sleep(10000);
                            Message in = exchange.getIn();
                            in.setBody("Slow reply to: " + in.getBody());
                        }
                    }).id("reallySlowProcessor")
                    .to("mock:out");
            }
        };
    }

    @Override
    public boolean isUseAdviceWith() {
        return true;
    }

    @Test
    public void testSubstitutionOfSlowProcessor() throws Exception {
        context.getRouteDefinition("slowRoute")
            .adviceWith(context, new AdviceWithRouteBuilder() {
                @Override
                public void configure() throws Exception {
                    weaveById("reallySlowProcessor").replace()
                        .transform().simple("Fast reply to: ${body}");
                }
            });
        context.start();

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.message(0).body().isEqualTo("Fast reply to: request");

        template.sendBody("direct:in", "request");

        assertMockEndpointsSatisfied();
    }
}
