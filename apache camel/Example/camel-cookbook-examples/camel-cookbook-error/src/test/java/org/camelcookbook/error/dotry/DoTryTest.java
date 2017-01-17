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

package org.camelcookbook.error.dotry;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.error.shared.FlakyException;
import org.junit.Test;

public class DoTryTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new DoTryRouteBuilder();
    }

    @Test
    public void testDoTryHappy() throws Exception {
        final MockEndpoint mockBefore = getMockEndpoint("mock:before");
        mockBefore.expectedBodiesReceived("Foo");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedMessageCount(0);

        final MockEndpoint mockFinally = getMockEndpoint("mock:finally");
        mockFinally.expectedBodiesReceived("Made it!");

        final MockEndpoint mockAfter = getMockEndpoint("mock:after");
        mockAfter.expectedBodiesReceived("Made it!");

        String response = null;
        try {
            response = template.requestBody("direct:start", "Foo", String.class);
        } catch (Throwable e) {
            fail("Shouldn't get here");
        }
        assertEquals("Made it!", response);

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testDoTryError() throws Exception {
        final MockEndpoint mockBefore = getMockEndpoint("mock:before");
        mockBefore.expectedBodiesReceived("Kaboom");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedBodiesReceived("Kaboom");

        final MockEndpoint mockFinally = getMockEndpoint("mock:finally");
        mockFinally.expectedBodiesReceived("Something Bad Happened!");

        final MockEndpoint mockAfter = getMockEndpoint("mock:after");
        mockAfter.expectedBodiesReceived("Something Bad Happened!");

        String response = null;
        try {
            response = template.requestBody("direct:start", "Kaboom", String.class);
        } catch (Throwable e) {
            fail("Shouldn't get here");
        }
        assertEquals("Something Bad Happened!", response);

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testDoTryUnHandled() throws Exception {
        final MockEndpoint mockBefore = getMockEndpoint("mock:before");
        mockBefore.expectedBodiesReceived("Kaboom");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedBodiesReceived("Kaboom");

        final MockEndpoint mockFinally = getMockEndpoint("mock:finally");
        mockFinally.expectedBodiesReceived("Something Bad Happened!");

        final MockEndpoint mockAfter = getMockEndpoint("mock:after");
        mockAfter.expectedMessageCount(0);

        String response = null;
        boolean threwException = false;
        try {
            response = template.requestBody("direct:unhandled", "Kaboom", String.class);
        } catch (Throwable e) {
            threwException = true;
            CamelExecutionException cee = assertIsInstanceOf(CamelExecutionException.class, e);
            Throwable cause = cee.getCause();
            assertIsInstanceOf(FlakyException.class, cause);
        }
        assertTrue(threwException);
        assertNull(response);

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testDoTryConditional() throws Exception {
        final MockEndpoint mockBefore = getMockEndpoint("mock:before");
        mockBefore.expectedBodiesReceived("Kaboom", "Kaboom");

        final MockEndpoint mockError = getMockEndpoint("mock:error");
        mockError.expectedBodiesReceived("Kaboom");

        final MockEndpoint mockFinally = getMockEndpoint("mock:finally");
        mockFinally.expectedBodiesReceived("Something Bad Happened!", "Kaboom");

        final MockEndpoint mockAfter = getMockEndpoint("mock:after");
        mockAfter.expectedBodiesReceived("Something Bad Happened!");

        String response = null;
        try {
            response = template.requestBody("direct:conditional", "Kaboom", String.class);
        } catch (Throwable e) {
            fail("Shouldn't get here");
        }
        assertEquals("Something Bad Happened!", response);

        response = null;
        boolean threwException = false;
        try {
            response = template.requestBodyAndHeader("direct:conditional", "Kaboom", "jedi", "This isn't the Exception you are looking for...", String.class);
        } catch (Throwable e) {
            threwException = true;
            CamelExecutionException cee = assertIsInstanceOf(CamelExecutionException.class, e);
            Throwable cause = cee.getCause();
            assertIsInstanceOf(FlakyException.class, cause);
        }
        assertTrue(threwException);
        assertNull(response);

        assertMockEndpointsSatisfied();
    }
}
