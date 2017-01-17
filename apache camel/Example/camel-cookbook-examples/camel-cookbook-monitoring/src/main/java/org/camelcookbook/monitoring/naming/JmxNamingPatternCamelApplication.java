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

package org.camelcookbook.monitoring.naming;

import org.apache.camel.CamelContext;
import org.apache.camel.LoggingLevel;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.ExplicitCamelContextNameStrategy;
import org.apache.camel.spi.ManagementAgent;
import org.apache.camel.spi.ManagementNameStrategy;
import org.apache.camel.spi.ManagementStrategy;

public class JmxNamingPatternCamelApplication {
    private CamelContext context;

    public CamelContext getContext() {
        return context;
    }

    public void setup() throws Exception {
        context = new DefaultCamelContext();

        context.setNameStrategy(new ExplicitCamelContextNameStrategy("myCamelContextName"));

        final ManagementStrategy managementStrategy = context.getManagementStrategy();

        final ManagementAgent managementAgent = managementStrategy.getManagementAgent();
        managementAgent.setMBeanServerDefaultDomain("org.apache.camel");

        final ManagementNameStrategy managementNameStrategy = context.getManagementNameStrategy();
        managementNameStrategy.setNamePattern("CustomName-#name#");

        // Add a simple test route
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:start")
                        .routeId("first-route")
                    .log(LoggingLevel.INFO, "First Route", "${body}")
                    .to("mock:result");

                from("direct:startOther")
                        .routeId("other-route")
                    .log(LoggingLevel.INFO, "Other Route", "${body}")
                    .to("mock:resultOther");
            }
        });
    }

    public void start() throws Exception {
        context.start();
    }

    public void tearDown() throws Exception {
        context.stop();
    }

    public static void main(String[] args) throws Exception {
        JmxNamingPatternCamelApplication camelApp = new JmxNamingPatternCamelApplication();

        try {
            camelApp.setup();
            camelApp.start();

            // Send a couple of messages to get some route statistics
            final ProducerTemplate template = camelApp.getContext().createProducerTemplate();

            template.sendBody("direct:start", "Hello Camel");
            template.sendBody("direct:start", "Camel Rocks!");

            template.sendBody("direct:startOther", "Hello Other Camel");
            template.sendBody("direct:startOther", "Other Camel Rocks!");

            // let the Camel runtime do its job for a while
            Thread.sleep(60000);
        } finally {
            camelApp.tearDown();
        }
    }
}
