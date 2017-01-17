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
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.ws.payment_service.types.TransferRequest;
import org.camelcookbook.ws.payment_service.types.TransferResponse;
import org.camelcookbook.ws.service.PaymentServiceImpl;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ClientSpringTest extends CamelSpringTestSupport {
    private final int port1 = AvailablePortFinder.getNextAvailable();

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        System.setProperty("port1", String.valueOf(port1));

        return new ClassPathXmlApplicationContext("META-INF/spring/client-context.xml");
    }

    @Override
    protected RouteBuilder[] createRouteBuilders() throws Exception {
        return new RouteBuilder[]{
            (RouteBuilder) super.createRouteBuilder(),
            new RouteBuilder() {
                @Override
                public void configure() throws Exception {
                    // Create a WS Consuming route for testing purposes
                    from("cxf:bean:paymentServiceEndpoint")
                        .transform(simple("${in.body[0]}"))
                        .bean(PaymentServiceImpl.class);
                }
            }
        };
    }

    @Test
    public void testClientSpring() {
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
