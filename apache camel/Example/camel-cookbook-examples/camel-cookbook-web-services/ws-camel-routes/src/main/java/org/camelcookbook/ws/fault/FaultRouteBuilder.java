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

package org.camelcookbook.ws.fault;

import org.apache.camel.builder.RouteBuilder;
import org.camelcookbook.ws.payment_service.Payment;

public class FaultRouteBuilder extends RouteBuilder {
    private int port1;

    public FaultRouteBuilder() {
    }

    public FaultRouteBuilder(int port1) {
        this.port1 = port1;
    }

    public void setPort1(int port1) {
        this.port1 = port1;
    }

    @Override
    public void configure() throws Exception {
        final String cxfUri =
            String.format("cxf:http://localhost:%d/paymentFaultService?serviceClass=%s",
                port1, Payment.class.getCanonicalName());

        from(cxfUri)
                .id("wsRoute")
            .onException(TransferException.class)
                .handled(true)
                .setFaultBody(method(FaultHandler.class, "createFault"))
            .end()
            .transform(simple("${in.body[0]}"))
            .log("request = ${body}")
            .bean(PaymentServiceImpl.class)
            .log("response = ${body}");
    }
}
