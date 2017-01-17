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

package org.camelcookbook.routing.wiretap;

import org.apache.camel.builder.RouteBuilder;
import org.camelcookbook.routing.model.CheeseCloningProcessor;
import org.camelcookbook.routing.model.CheeseRipener;

/**
 * Route showing wiretap without state leakage.
 */
public class WireTapStateNoLeaksRouteBuilder extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        from("direct:start")
            .log("Cheese is ${body.age} months old")
            .wireTap("direct:processInBackground")
                .onPrepare(new CheeseCloningProcessor())
            .delay(constant(1000))
            .to("mock:out");

        from("direct:processInBackground")
            .bean(CheeseRipener.class, "ripen")
            .to("mock:tapped");
    }
}
