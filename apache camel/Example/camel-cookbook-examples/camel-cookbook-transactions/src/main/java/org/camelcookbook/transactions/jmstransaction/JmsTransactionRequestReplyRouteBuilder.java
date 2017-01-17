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
 * Demonstrates the correct use of transactions with JMS when you need to perform a request-reply.
 */
public class JmsTransactionRequestReplyRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("jms:inbound").startupOrder(3)
            .transacted("PROPAGATION_REQUIRED")
            .log("Processing message ${body}")
            .to("jms:auditQueue") // this send is transacted
            .inOut("direct:invokeBackendService")
            .to("mock:out");

        from("direct:invokeBackendService").startupOrder(2)
            .transacted("PROPAGATION_NOT_SUPPORTED")
            .to("jms:backendService"); // this send is not

        // fake back-end service that processes requests
        from("jms:backendService").startupOrder(1)
            .transform(simple("Backend processed: ${body}"))
            .to("mock:backEndReply");
    }
}
