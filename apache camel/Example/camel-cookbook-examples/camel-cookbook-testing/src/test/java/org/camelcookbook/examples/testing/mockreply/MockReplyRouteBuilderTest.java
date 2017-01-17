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

package org.camelcookbook.examples.testing.mockreply;

import org.apache.camel.*;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.SimpleBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.language.constant.ConstantLanguage;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class MockReplyRouteBuilderTest extends CamelTestSupport {

    @EndpointInject(uri = "mock:replying")
    private MockEndpoint mockReplying;

    @EndpointInject(uri = "mock:out")
    private MockEndpoint mockOut;

    @Produce(uri = "direct:in")
    ProducerTemplate in;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new MockReplyRouteBuilder();
    }

    @Test
    public void testReplyingFromMockByExpression() throws InterruptedException {
        mockReplying.returnReplyBody(SimpleBuilder.simple("Hello ${body}"));
        mockOut.expectedBodiesReceived("Hello Camel");

        in.sendBody("Camel");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testReplyingWithHeaderFromMockByExpression() throws InterruptedException {
        mockReplying.returnReplyHeader("responder", ConstantLanguage.constant("fakeService"));
        mockOut.message(0).header("responder").isEqualTo("fakeService");

        in.sendBody("Camel");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testReplyingFromMockByProcessor() throws InterruptedException {
        mockReplying.whenAnyExchangeReceived(new Processor() {
            @Override
            public void process(Exchange exchange) throws Exception {
                Message in = exchange.getIn();
                in.setBody("Hey " + in.getBody());
            }
        });

        // the 1st exchange will be handled by a different Processor
        mockReplying.whenExchangeReceived(1, new Processor() {
            @Override
            public void process(Exchange exchange) throws Exception {
                Message in = exchange.getIn();
                in.setBody("Czesc " + in.getBody()); // Polish
            }
        });

        mockOut.expectedBodiesReceived("Czesc Camel", "Hey Camel", "Hey Camel");

        in.sendBody("Camel");
        in.sendBody("Camel");
        in.sendBody("Camel");

        assertMockEndpointsSatisfied();
    }
}
