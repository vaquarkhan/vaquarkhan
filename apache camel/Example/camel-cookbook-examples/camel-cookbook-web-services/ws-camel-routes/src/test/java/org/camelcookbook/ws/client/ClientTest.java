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

package org.camelcookbook.ws.client;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.AvailablePortFinder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.ws.payment_service.types.TransferRequest;
import org.camelcookbook.ws.payment_service.types.TransferResponse;
import org.camelcookbook.ws.service.PaymentServiceImpl;
import org.junit.Test;

public class ClientTest extends CamelTestSupport {
    private final int port1 = AvailablePortFinder.getNextAvailable();

    @Override
    protected RouteBuilder[] createRouteBuilders() throws Exception {
        return new RouteBuilder[]{
            new ClientRouteBuilder(port1),
            new RouteBuilder() {
                @Override
                public void configure() throws Exception {
                    // Create a WS Consuming route for testing purposes
                    from(String.format("cxf:http://localhost:%d/paymentService?serviceClass=org.camelcookbook.ws.payment_service.Payment", port1))
                        .transform(simple("${in.body[0]}"))
                        .bean(PaymentServiceImpl.class);
                }
            }
        };
    }

    @Test
    public void testClient() {
        TransferRequest request = new TransferRequest();
        request.setBank("Bank of Camel");
        request.setFrom("Jakub");
        request.setTo("Scott");
        request.setAmount("1");

        TransferResponse response = template.requestBody("direct:start", request, TransferResponse.class);

        assertNotNull(response);
        assertEquals("OK", response.getReply());
    }
}
