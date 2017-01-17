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

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;

/**
 * Example shows multicast stopping on exception.
 */
public class MulticastStopOnExceptionRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("direct:start")
            .multicast().stopOnException()
                .to("direct:first")
                .to("direct:second")
            .end()
            .log("continuing with ${body}") // this will never be called
            .to("mock:afterMulticast")
            .transform(body()); // copy the In message to the Out message; this will become the route response

        from("direct:first")
            .onException(Exception.class)
                .handled(true)
                .log("Caught exception")
                .to("mock:exceptionHandler")
                .transform(constant("Oops"))
            .end()
            .to("mock:first")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    throw new IllegalStateException("something went horribly wrong");
                }
            });

        from("direct:second")
            .to("mock:second")
            .transform(constant("All OK here"));
    }
}
