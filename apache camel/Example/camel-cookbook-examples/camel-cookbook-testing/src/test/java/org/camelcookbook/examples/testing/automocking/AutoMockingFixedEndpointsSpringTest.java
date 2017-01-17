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

package org.camelcookbook.examples.testing.automocking;

import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class AutoMockingFixedEndpointsSpringTest extends CamelSpringTestSupport {

    @Produce(uri = "activemq:in")
    private ProducerTemplate in;

    @EndpointInject(uri = "mock:activemq:out")
    private MockEndpoint mockOut;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/fixedEndpoints-context.xml");
    }

    @Override
    public String isMockEndpoints() {
        return "activemq:out";
    }

    @Test
    public void testTransformationThroughAutoMock() throws Exception {
        mockOut.expectedBodiesReceived("Modified: testMessage");
        in.sendBody("testMessage");
        mockOut.assertIsSatisfied();
    }
}
