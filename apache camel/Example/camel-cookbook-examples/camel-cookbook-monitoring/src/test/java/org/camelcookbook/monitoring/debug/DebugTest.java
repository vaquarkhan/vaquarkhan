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

package org.camelcookbook.monitoring.debug;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.ProcessorDefinition;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class DebugTest extends CamelTestSupport {
    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new DebugRouteBuilder();
    }

    @Override
    public boolean isUseDebugger() {
        return true;
    }

    @Override
    protected void debugAfter(Exchange exchange, Processor processor, ProcessorDefinition<?> definition, String id, String label, long timeTaken) {
        // This method is called after each processor step
        // Set your breakpoint here
        log.info("After {} with body {}", definition, exchange.getIn().getBody());
    }

    @Override
    protected void debugBefore(Exchange exchange, Processor processor, ProcessorDefinition<?> definition, String id, String label) {
        // This method is called before each processor step
        // Set your breakpoint here
        log.info("Before {} with body {}", definition, exchange.getIn().getBody());
    }

    @Test
    public void testDebug() throws InterruptedException {
        getMockEndpoint("mock:result").expectedBodiesReceived("Debug Hello Camel");

        template.sendBody("direct:start", "Hello Camel");

        assertMockEndpointsSatisfied();
    }
}
