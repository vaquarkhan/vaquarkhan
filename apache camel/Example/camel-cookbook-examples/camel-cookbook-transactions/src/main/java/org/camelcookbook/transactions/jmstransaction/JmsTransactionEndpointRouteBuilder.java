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

package org.camelcookbook.transactions.jmstransaction;

import org.apache.camel.builder.RouteBuilder;

/**
 * Demonstrates the use of local transactions initiated via the transacted attribute on a consumer endpoint.
 */
public class JmsTransactionEndpointRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("jms:inbound?transacted=true")
            .log("Processing message: ${body}")
            // this send is transacted, so the message will not be sent until processing has completed
            .to("jms:outbound")
            .to("mock:out");
    }
}
