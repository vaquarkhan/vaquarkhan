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

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Test class that demonstrates split message processing in parallel through a custom executor service.
 *
 * @author jkorab
 */
public class SplitExecutorServiceSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext(
            "/META-INF/spring/splitExecutorService-context.xml");
    }

    @Test
    public void testSplittingInParallel() throws InterruptedException {
        List<String> messageFragments = new ArrayList<String>();
        int fragmentCount = 50;
        for (int i = 0; i < fragmentCount; i++) {
            messageFragments.add("fragment" + i);
        }
        MockEndpoint mockSplit = getMockEndpoint("mock:split");
        mockSplit.setExpectedMessageCount(fragmentCount);
        mockSplit.expectedBodiesReceivedInAnyOrder(messageFragments);

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).body().isEqualTo(messageFragments);

        template.sendBody("direct:in", messageFragments);

        assertMockEndpointsSatisfied();
    }

}
