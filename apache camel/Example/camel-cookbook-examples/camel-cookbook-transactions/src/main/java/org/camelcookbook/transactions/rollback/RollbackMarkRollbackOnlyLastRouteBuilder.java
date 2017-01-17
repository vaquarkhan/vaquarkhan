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

package org.camelcookbook.transactions.rollback;

import org.apache.camel.builder.RouteBuilder;

/**
 * Demonstrates the behavior of marking the last transaction for rollback.
 */
public class RollbackMarkRollbackOnlyLastRouteBuilder extends RouteBuilder {

    @Override
    public void configure() {
        from("direct:route1").id("route1")
            .setHeader("message", simple("${body}"))
            .policy("PROPAGATION_REQUIRES_NEW").id("tx1")
                .to("sql:insert into messages (message) values (:#message)")
                .to("direct:route2")
                .to("mock:out1")
            .end();

        from("direct:route2").id("route2")
            .policy("PROPAGATION_REQUIRES_NEW-2").id("tx2")
                .to("sql:insert into audit_log (message) values (:#message)")
                .choice()
                    .when(simple("${body} contains 'explode'"))
                        .log("Message cannot be processed further - rolling back insert")
                        .markRollbackOnlyLast()
                    .otherwise()
                        .log("Message processed successfully")
                .end()
                .to("mock:out2")
            .end();
    }
}
