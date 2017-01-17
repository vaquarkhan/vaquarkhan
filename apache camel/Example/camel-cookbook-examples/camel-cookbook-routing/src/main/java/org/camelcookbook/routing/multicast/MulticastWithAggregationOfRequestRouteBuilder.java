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

package org.camelcookbook.routing.multicast;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.processor.aggregate.AggregationStrategy;

/**
 * Simple multicast example with parallel processing.
 */
public class MulticastWithAggregationOfRequestRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        AggregationStrategy concatenationStrategy = new ConcatenatingAggregationStrategy();

        from("direct:start")
            .enrich("direct:performMulticast", concatenationStrategy)
            .transform(body()); // copy the In message to the Out message; this will become the route response

        from("direct:performMulticast")
            .multicast().aggregationStrategy(concatenationStrategy)
                .to("direct:first")
                .to("direct:second")
            .end();

        from("direct:first")
            .transform(constant("first response"));

        from("direct:second")
            .transform(constant("second response"));
    }
}
