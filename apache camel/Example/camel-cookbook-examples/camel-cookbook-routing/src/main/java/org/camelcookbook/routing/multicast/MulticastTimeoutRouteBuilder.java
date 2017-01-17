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

/**
 * Simple multicast example with timeout.
 */
public class MulticastTimeoutRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("direct:start")
            .multicast().parallelProcessing().timeout(3000)
                .to("direct:first")
                .to("direct:second")
            .end()
            .setHeader("threadName").simple("${threadName}")
            .to("mock:afterMulticast")
            .transform(constant("response"));

        from("direct:first")
            .setHeader("firstModifies").constant("apple")
            .setHeader("threadName").simple("${threadName}")
            .to("mock:first");

        from("direct:second")
            .onCompletion().onWhen(header("timedOut").isNull())
                .log("operation rolling back")
            .end()
            .setHeader("secondModifies").constant("banana")
            .setHeader("threadName").simple("${threadName}")
            .delay(5000)
            .to("mock:second")
            .filter(exchangeProperty("CamelMulticastComplete").isEqualTo(false))
            .setHeader("timedOut", constant("false"));
    }
}
