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

package org.camelcookbook.parallelprocessing.threadpoolprofiles;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.ThreadPoolProfileBuilder;
import org.apache.camel.model.ModelCamelContext;
import org.apache.camel.spi.ThreadPoolProfile;

/**
 * Route that demonstrates using the Threads DSL to process messages using a custom thread pool defined in the
 * Camel registry.
 */
public class CustomThreadPoolProfileRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        ThreadPoolProfile customThreadPoolProfile =
            new ThreadPoolProfileBuilder("customThreadPoolProfile").poolSize(5).maxQueueSize(100).build();
        ModelCamelContext context = getContext();
        context.getExecutorServiceManager().registerThreadPoolProfile(customThreadPoolProfile);

        from("direct:in")
            .log("Received ${body}:${threadName}")
            .threads().executorServiceRef("customThreadPoolProfile")
            .log("Processing ${body}:${threadName}")
            .transform(simple("${threadName}"))
            .to("mock:out");
    }
}
