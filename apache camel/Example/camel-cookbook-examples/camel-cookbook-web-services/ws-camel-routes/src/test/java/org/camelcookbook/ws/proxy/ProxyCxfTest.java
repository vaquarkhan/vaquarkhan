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

package org.camelcookbook.ws.proxy;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.AvailablePortFinder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.apache.cxf.binding.soap.SoapFault;
import org.camelcookbook.ws.fault.FaultHandler;
import org.camelcookbook.ws.fault.PaymentServiceImpl;
import org.camelcookbook.ws.fault.TransferException;
import org.camelcookbook.ws.payment_service.FaultMessage;
import org.camelcookbook.ws.payment_service.Payment;
import org.camelcookbook.ws.payment_service.types.TransferRequest;
import org.camelcookbook.ws.payment_service.types.TransferResponse;
import org.junit.Test;

public class ProxyCxfTest extends CamelTestSupport {
    private final int port1 = AvailablePortFinder.getNextAvailable();
    private final int port2 = AvailablePortFinder.getNextAvailable();

    @Override
    protected RouteBuilder[] createRouteBuilders() throws Exception {
        return new RouteBuilder[]{
            new ProxyRouteBuilder(port1, port2),
            new RouteBuilder() {
                @Override
                public void configure() throws Exception {
                    // Create a WS Consuming route for testing purposes
                    from(String.format("cxf:http://localhost:%d/paymentService?serviceClass=%s", port2, Payment.class.getCanonicalName()))
                            .id("wsBackend")
                        .onException(TransferException.class)
                            .handled(true)
                            .setFaultBody(method(FaultHandler.class, "createFault"))
                        .end()
                        .transform(simple("${in.body[0]}"))
                        .bean(PaymentServiceImpl.class);
                }
            }
        };
    }

    @Test
    public void testProxy() throws Exception {
        TransferRequest request = new TransferRequest();
        request.setBank("Bank of Camel");
        request.setFrom("Jakub");
        request.setTo("Scott");
        request.setAmount("1");

        context.startRoute("wsBackend");
        assertTrue(context.getRouteStatus("wsBackend").isStarted());

        TransferResponse response = template.requestBody("cxf:http://localhost:" + port1 + "/paymentService?serviceClass=org.camelcookbook.ws.payment_service.Payment", request, TransferResponse.class);

        assertNotNull(response);
        assertEquals("OK", response.getReply());
    }

    @Test
    public void testProxyRedelivery() throws Exception {
        TransferRequest request = new TransferRequest();
        request.setBank("Bank of Camel");
        request.setFrom("Jakub");
        request.setTo("Scott");
        request.setAmount("1");

        context.stopRoute("wsBackend");
        assertTrue(context.getRouteStatus("wsBackend").isStopped());

        try {
            TransferResponse response = template.requestBody("cxf:http://localhost:" + port1 + "/paymentService?serviceClass=org.camelcookbook.ws.payment_service.Payment", request, TransferResponse.class);
            fail("Should have failed as backend WS is down");
        } catch (CamelExecutionException e) {
            SoapFault fault = assertIsInstanceOf(SoapFault.class, e.getCause());
            log.info(fault.getReason());
        }
    }

    @Test
    public void testProxyFault() throws Exception {
        TransferRequest request = new TransferRequest();
        request.setBank("Bank of Camel");
        request.setFrom("Jakub");
        request.setTo("Scott");
        request.setAmount("10000"); // should trigger backend to throw fault

        context.startRoute("wsBackend");
        assertTrue(context.getRouteStatus("wsBackend").isStarted());

        try {
            TransferResponse response = template.requestBody("cxf:http://localhost:" + port1 + "/paymentService?serviceClass=org.camelcookbook.ws.payment_service.Payment", request, TransferResponse.class);
            fail("Should have failed as backend should throw fault");
        } catch (CamelExecutionException e) {
            FaultMessage fault = assertIsInstanceOf(FaultMessage.class, e.getCause());
            log.info(fault.getLocalizedMessage());
        }
    }
}
