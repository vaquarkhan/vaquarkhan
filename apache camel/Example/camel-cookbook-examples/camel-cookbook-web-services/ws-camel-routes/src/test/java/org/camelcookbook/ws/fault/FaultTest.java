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

import org.apache.camel.CamelExecutionException;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.AvailablePortFinder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.ws.payment_service.FaultMessage;
import org.camelcookbook.ws.payment_service.types.TransferRequest;
import org.camelcookbook.ws.payment_service.types.TransferResponse;
import org.junit.Test;

public class FaultTest extends CamelTestSupport {
    private final int port1 = AvailablePortFinder.getNextAvailable();

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new FaultRouteBuilder(port1);
    }

    @Test
    public void testFault() {
        TransferRequest request = new TransferRequest();
        request.setBank("Bank of Camel");
        request.setFrom("Jakub");
        request.setTo("Scott");
        request.setAmount("1");

        TransferResponse response = template.requestBody(String.format("cxf:http://localhost:%d/paymentFaultService?serviceClass=org.camelcookbook.ws.payment_service.Payment", port1), request, TransferResponse.class);

        assertNotNull(response);
        assertEquals("OK", response.getReply());

        request.setAmount("10000");

        try {
            response = template.requestBody(String.format("cxf:http://localhost:%d/paymentFaultService?serviceClass=org.camelcookbook.ws.payment_service.Payment", port1), request, TransferResponse.class);
            fail("Request should have failed");
        } catch (CamelExecutionException e) {
            FaultMessage fault = assertIsInstanceOf(FaultMessage.class, e.getCause());

            log.info("reason = {}", fault.getMessage());
        }
    }
}
