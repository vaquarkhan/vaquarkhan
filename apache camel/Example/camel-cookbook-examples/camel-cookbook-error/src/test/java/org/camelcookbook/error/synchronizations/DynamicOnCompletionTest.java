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

package org.camelcookbook.error.synchronizations;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Demonstrates the use of a Synchronization to change state depending on whether an Exchange completed or failed.
 */
public class DynamicOnCompletionTest extends CamelTestSupport {

    public static final String COMPLETING_BODY = "this message should complete";
    public static final String FAILING_BODY = "this message should explode";

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new DynamicOnCompletionRouteBuilder();
    }

    @Test
    public void testOnCompletionCompleted() throws InterruptedException {
        MockEndpoint mockStart = getMockEndpoint("mock:start");
        mockStart.setExpectedMessageCount(1);
        mockStart.message(0).body().isEqualTo(COMPLETING_BODY);

        MockEndpoint mockCancel = getMockEndpoint("mock:cancel");
        mockCancel.setExpectedMessageCount(0);

        MockEndpoint mockConfirm = getMockEndpoint("mock:confirm");
        mockConfirm.setExpectedMessageCount(1);
        mockConfirm.message(0).body().isEqualTo(COMPLETING_BODY);

        template.asyncSendBody("direct:in", COMPLETING_BODY);

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testOnCompletionFailed() throws InterruptedException {
        MockEndpoint mockStart = getMockEndpoint("mock:start");
        mockStart.setExpectedMessageCount(1);
        mockStart.message(0).body().isEqualTo(FAILING_BODY);

        MockEndpoint mockCancel = getMockEndpoint("mock:cancel");
        mockCancel.setExpectedMessageCount(1);
        mockCancel.message(0).body().isEqualTo(FAILING_BODY);

        MockEndpoint mockConfirm = getMockEndpoint("mock:confirm");
        mockConfirm.setExpectedMessageCount(0);

        template.asyncSendBody("direct:in", FAILING_BODY);

        assertMockEndpointsSatisfied();
    }
}
