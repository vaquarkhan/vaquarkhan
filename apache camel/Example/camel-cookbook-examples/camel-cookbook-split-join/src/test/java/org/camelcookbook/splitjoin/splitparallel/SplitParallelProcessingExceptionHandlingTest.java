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

package org.camelcookbook.splitjoin.splitparallel;

import java.util.ArrayList;
import java.util.List;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Test class that demonstrates exception handling when processing split messages in parallel.
 */
public class SplitParallelProcessingExceptionHandlingTest extends CamelTestSupport {

    @Override
    public RouteBuilder createRouteBuilder() {
        return new SplitParallelProcessingExceptionHandlingRouteBuilder();
    }

    @Test
    public void testSplittingInParallel() throws InterruptedException {
        List<String> messageFragments = new ArrayList<String>();
        int fragmentCount = 50;
        for (int i = 0; i < fragmentCount; i++) {
            messageFragments.add("fragment" + i);
        }

        int indexOnWhichExceptionThrown = 20;
        MockEndpoint mockSplit = getMockEndpoint("mock:split");
        mockSplit.setMinimumExpectedMessageCount(indexOnWhichExceptionThrown);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(0);

        try {
            template.sendBody("direct:in", messageFragments);
            fail();
        } catch (Exception e) {
            assertMockEndpointsSatisfied();
        }
    }
}
