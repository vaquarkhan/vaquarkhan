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

package org.camelcookbook.error.oncompletion;

import org.apache.camel.builder.RouteBuilder;

/**
 * Route that demonstrates the use of the onCompletion DSL statement
 */
public class OnCompletionRouteBuilder extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        onCompletion()
            .log("global onCompletion thread: ${threadName}")
            .to("mock:global");

        from("direct:onCompletion")
            .onCompletion()
                .log("onCompletion triggered: ${threadName}")
                .to("mock:completed")
            .end()
            .log("Processing message: ${threadName}");

        from("direct:noOnCompletion")
            .log("Original thread: ${threadName}")
            .choice()
                .when(simple("${body} contains 'explode'"))
                    .throwException(new IllegalArgumentException("Exchange caused explosion"))
            .endChoice();

        from("direct:onCompletionFailure")
            .onCompletion().onFailureOnly()
                .log("onFailureOnly thread: ${threadName}")
                .to("mock:failed")
            .end()
            .log("Original thread: ${threadName}")
            .choice()
                .when(simple("${body} contains 'explode'"))
                    .throwException(new IllegalArgumentException("Exchange caused explosion"))
            .endChoice();

        from("direct:onCompletionFailureConditional")
            .onCompletion()
                    .onFailureOnly()
                    .onWhen(simple("${exception.class} == 'java.lang.IllegalArgumentException'"))
                .log("onFailureOnly thread: ${threadName}: ${exception.class}")
                .to("mock:failed")
            .end()
            .log("Original thread: ${threadName}")
            .choice()
                .when(simple("${body} contains 'explode'"))
                    .throwException(new IllegalArgumentException("Exchange caused explosion"))
            .endChoice();

        from("direct:chained")
            .log("chained")
            .onCompletion().onCompleteOnly()
                .log("onCompleteOnly thread: ${threadName}")
                .to("mock:completed")
            .end()
            .to("direct:onCompletionFailure"); // calls out to route with onCompletion set

        from("direct:onCompletionChoice")
            .onCompletion()
                .to("direct:processCompletion")
            .end()
            .log("Original thread: ${threadName}")
            .choice()
                .when(simple("${body} contains 'explode'"))
                .throwException(new IllegalArgumentException("Exchange caused explosion"))
            .endChoice();

        from("direct:processCompletion")
            .log("onCompletion thread: ${threadName}")
            .log("${body}")
            .choice()
                //.when(simple("${exception.class} == null"))
                // Since CAMEL-7707 we cannot get exception here, but onWhen still work
                .when(simple("${body} contains 'complete'"))
                    .to("mock:completed")
                .otherwise()
                    .to("mock:failed")
            .endChoice();
    }
}
