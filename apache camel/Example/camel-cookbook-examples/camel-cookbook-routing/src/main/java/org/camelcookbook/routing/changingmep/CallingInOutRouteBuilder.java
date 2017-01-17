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

package org.camelcookbook.routing.changingmep;

import org.apache.camel.builder.RouteBuilder;

/**
 * Changing the MEP of a message for one endpoint invocation to InOut.
 */
public class CallingInOutRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("direct:start")
            .to("mock:beforeMessageModified")
            .inOut("direct:modifyMessage")
            .to("log:mainRoute?showAll=true")
            .to("mock:afterMessageModified");

        from("direct:modifyMessage")
            .to("mock:modifyMessage")
            .to("log:subRoute?showAll=true")
            .transform(simple("[${body}] has been modified!"));
    }
}
