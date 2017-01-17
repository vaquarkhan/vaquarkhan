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

package org.camelcookbook.monitoring.jmxdisable;

import org.apache.camel.CamelContext;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;

public class JmxDisableCamelApplication {
    public static void main(String[] args) throws Exception {
        final CamelContext context = new DefaultCamelContext();

        // Disable JMX. Call before context.start()
        context.disableJMX();

        // Add a simple test route
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:start")
                    .log("${body}")
                    .to("mock:result");
            }
        });

        // Start the context
        context.start();

        // Send a couple of messages to get some route statistics
        final ProducerTemplate template = context.createProducerTemplate();
        template.sendBody("direct:start", "Hello Camel");
        template.sendBody("direct:start", "Camel Rocks!");

        // let the Camel runtime do its job for a while
        Thread.sleep(60000);

        // shutdown
        context.stop();
    }
}
