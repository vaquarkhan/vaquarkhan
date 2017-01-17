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

package org.camelcookbook.transactions.xatransaction;

import org.apache.camel.builder.RouteBuilder;

/**
 * Demonstrates the use of an XA transaction manager with a JMS component and database.
 */
public class XATransactionRouteBuilder extends RouteBuilder {

    @Override
    public void configure() {
        from("jms:inbound?transacted=true")
            .transacted("PROPAGATION_REQUIRED")
            .log("Processing message: ${body}")
            .setHeader("message", body())
            .to("sql:insert into audit_log (message) values (:#message)")
            .to("jms:outbound") // this send is transacted, so the message should not be sent
            .to("mock:out");
    }
}
