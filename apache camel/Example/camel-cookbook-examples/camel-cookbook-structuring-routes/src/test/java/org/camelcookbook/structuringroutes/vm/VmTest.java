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

package org.camelcookbook.structuringroutes.vm;

import org.apache.camel.CamelContext;
import org.apache.camel.Message;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;

/**
 * To test communication between Camel contexts in the same JVM, we are going to wire up the test my hand instead of
 * relying on CamelTestSupport.
 */
public class VmTest {

    private CamelContext testHarnessContext;
    private CamelContext externalLoggingContext;

    @Before
    public void setupContexts() throws Exception {
        testHarnessContext = new DefaultCamelContext();
        testHarnessContext.addRoutes(new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:in")
                    .setHeader("harness.threadName", simple("${threadName}"))
                    .to("vm:logMessageToBackendSystem")
                    .log("Completed logging");
            }
        });
        testHarnessContext.start();

        externalLoggingContext = new DefaultCamelContext();
        externalLoggingContext.addRoutes(new ExternalLoggingRouteBuilder("vm"));
        externalLoggingContext.start();
    }

    @After
    public void shutdownContexts() throws Exception {
        testHarnessContext.stop();
        externalLoggingContext.stop();
    }

    @Test
    public void testMessagePassing() throws InterruptedException {
        ProducerTemplate producerTemplate = testHarnessContext.createProducerTemplate();

        MockEndpoint out = externalLoggingContext.getEndpoint("mock:out", MockEndpoint.class);
        out.setExpectedMessageCount(1);
        out.message(0).body().isEqualTo("logging: something happened");

        producerTemplate.sendBody("direct:in", "something happened");
        out.assertIsSatisfied(1000);
        Message message = out.getExchanges().get(0).getIn();
        assertFalse(message.getHeader("harness.threadName").equals(
            message.getHeader(ExternalLoggingRouteBuilder.LOGGING_THREAD_NAME)));
    }
}
