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

package org.camelcookbook.parallelprocessing.threadpools;

import java.util.concurrent.ExecutorService;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.ThreadPoolBuilder;

/**
 * Route that demonstrates using the Threads DSL to process messages using a custom thread pool defined inline.
 */
public class CustomThreadPoolInlineRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        CamelContext context = getContext();
        ExecutorService executorService = new ThreadPoolBuilder(context).poolSize(5).maxQueueSize(100).build("CustomThreadPool");

        from("direct:in")
            .log("Received ${body}:${threadName}")
            .threads().executorService(executorService)
            .log("Processing ${body}:${threadName}")
            .transform(simple("${threadName}"))
            .to("mock:out");
    }
}
