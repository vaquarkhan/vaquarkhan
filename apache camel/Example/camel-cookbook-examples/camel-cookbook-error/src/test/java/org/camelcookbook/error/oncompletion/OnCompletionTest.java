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

package org.camelcookbook.error.oncompletion;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Demonstrates the use of onCompletion blocks.
 */
public class OnCompletionTest extends CamelTestSupport {

    @Override
    protected RouteBuilder[] createRouteBuilders() throws Exception {
        return new RouteBuilder[]{
            new OnCompletionRouteBuilder(),
            new RouteBuilder() {
                @Override
                public void configure() throws Exception {
                    from("direct:inAnotherRouteBuilder")
                        .log("No global onCompletion should apply")
                        .to("mock:outAnotherRouteBuilder");
                }
            }
        };
    }

    @Test
    public void testOnCompletionDefinedAtRouteLevel() throws InterruptedException {
        MockEndpoint mockCompleted = getMockEndpoint("mock:completed");
        mockCompleted.setExpectedMessageCount(1);
        mockCompleted.message(0).body().isEqualTo("this message should be fine");

        template.asyncSendBody("direct:onCompletion", "this message should be fine");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionFailureAtRouteLevel() throws InterruptedException {
        MockEndpoint mockFailed = getMockEndpoint("mock:failed");
        mockFailed.setExpectedMessageCount(1);
        mockFailed.message(0).body().isEqualTo("this message should explode");

        template.asyncSendBody("direct:onCompletionFailure", "this message should explode");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionFailureConditional() throws InterruptedException {
        MockEndpoint mockFailed = getMockEndpoint("mock:failed");
        mockFailed.setExpectedMessageCount(1);
        mockFailed.message(0).body().isEqualTo("this message should explode");

        template.asyncSendBody("direct:onCompletionFailureConditional", "this message should explode");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionGlobal() throws InterruptedException {
        MockEndpoint mockGlobal = getMockEndpoint("mock:global");
        mockGlobal.setExpectedMessageCount(1);
        mockGlobal.message(0).body().isEqualTo("this message should explode");

        template.asyncSendBody("direct:noOnCompletion", "this message should explode");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionGlobalNotInvokedFromAnotherRouteBuilder() throws InterruptedException {
        MockEndpoint mockGlobal = getMockEndpoint("mock:global");
        mockGlobal.setExpectedMessageCount(0);

        MockEndpoint mockOutAnotherRouteBuilder = getMockEndpoint("mock:outAnotherRouteBuilder");
        mockOutAnotherRouteBuilder.setExpectedMessageCount(1);
        mockOutAnotherRouteBuilder.message(0).body().isEqualTo("test message");

        template.asyncSendBody("direct:inAnotherRouteBuilder", "test message");

        Thread.sleep(100); // give global a chance to kick in, if it will
        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionChained() throws InterruptedException {
        MockEndpoint mockFailed = getMockEndpoint("mock:failed");
        mockFailed.setExpectedMessageCount(1);
        mockFailed.message(0).body().isEqualTo("this message should explode");

        MockEndpoint mockCompleted = getMockEndpoint("mock:completed");
        mockCompleted.setExpectedMessageCount(1);
        mockCompleted.message(0).body().isEqualTo("this message should complete");

        // here we have 2 onCompletions set - one on a top-level route, and another on a sub-route
        // both should be triggered depending on success or failure
        template.asyncSendBody("direct:chained", "this message should explode");
        template.asyncSendBody("direct:chained", "this message should complete");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionChoice() throws InterruptedException {
        MockEndpoint mockFailed = getMockEndpoint("mock:failed");
        mockFailed.setExpectedMessageCount(1);
        mockFailed.message(0).body().isEqualTo("this message should explode");

        MockEndpoint mockCompleted = getMockEndpoint("mock:completed");
        mockCompleted.setExpectedMessageCount(1);
        mockCompleted.message(0).body().isEqualTo("this message should complete");

        // here we have 2 onCompletions set - one on a top-level route, and another on a sub-route
        // both should be triggered depending on success or failure
        template.asyncSendBody("direct:onCompletionChoice", "this message should explode");
        template.asyncSendBody("direct:onCompletionChoice", "this message should complete");

        assertMockEndpointsSatisfied();
    }
}
