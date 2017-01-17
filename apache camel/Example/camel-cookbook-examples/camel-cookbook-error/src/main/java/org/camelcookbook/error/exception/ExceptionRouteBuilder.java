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

package org.camelcookbook.error.exception;

import java.util.Arrays;

import org.apache.camel.builder.RouteBuilder;
import org.camelcookbook.error.shared.FlakyException;
import org.camelcookbook.error.shared.FlakyProcessor;
import org.camelcookbook.error.shared.SporadicException;

public class ExceptionRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        onException(FlakyException.class, SporadicException.class).to("mock:error");
        onException(Exception.class).to("mock:genericerror");

        from("direct:start")
            .bean(FlakyProcessor.class)
            .to("mock:result");

        from("direct:handled")
                .onException(FlakyException.class)
                    .handled(true)
                    .transform(constant("Something Bad Happened!"))
                    .to("mock:error")
                .end()
            .bean(FlakyProcessor.class)
            .transform(constant("All Good"))
            .to("mock:result");

        from("direct:continue")
                .onException(FlakyException.class)
                    .continued(true)
                    .to("mock:ignore")
                .end()
            .bean(FlakyProcessor.class)
            .transform(constant("All Good"))
            .to("mock:result");
    }
}
