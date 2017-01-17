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

package org.camelcookbook.ws.multipleoperations;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.test.AvailablePortFinder;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.ws.payment_service_v2.types.CheckStatusRequest;
import org.camelcookbook.ws.payment_service_v2.types.CheckStatusResponse;
import org.camelcookbook.ws.payment_service_v2.types.TransferRequest;
import org.camelcookbook.ws.payment_service_v2.types.TransferResponse;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class OperationSpringTest extends CamelSpringTestSupport {
    private final int port1 = AvailablePortFinder.getNextAvailable();

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        System.setProperty("port1", String.valueOf(port1));

        return new ClassPathXmlApplicationContext("META-INF/spring/mutipleOperations-context.xml");
    }

    @Test
    public void testOperationSpring() {
        TransferRequest transferRequest = new TransferRequest();
        transferRequest.setBank("Bank of Camel");
        transferRequest.setFrom("Jakub");
        transferRequest.setTo("Scott");
        transferRequest.setAmount("1");

        TransferResponse transferResponse = template.requestBodyAndHeader(String.format("cxf:http://localhost:%d/paymentServicev2?serviceClass=org.camelcookbook.ws.payment_service_v2.Payment", port1), transferRequest, "operationName", "transferFunds", TransferResponse.class);

        assertNotNull(transferResponse);
        assertEquals("OK", transferResponse.getReply());

        CheckStatusRequest checkStatusRequest = new CheckStatusRequest();
        checkStatusRequest.setId(transferResponse.getId());
        checkStatusRequest.setBank("Bank of Camel");
        checkStatusRequest.setFrom("Jakub");

        CheckStatusResponse checkStatusResponse = template.requestBodyAndHeader(String.format("cxf:http://localhost:%d/paymentServicev2?serviceClass=org.camelcookbook.ws.payment_service_v2.Payment", port1), checkStatusRequest, "operationName", "checkStatus", CheckStatusResponse.class);

        assertNotNull(checkStatusResponse);
        assertEquals("Complete", checkStatusResponse.getStatus());
    }

    @Test
    public void testOperationInvalidOperationNameSpring() {
        try {
            Object response = template.requestBodyAndHeader(String.format("cxf:http://localhost:%d/paymentServicev2?serviceClass=org.camelcookbook.ws.payment_service_v2.Payment", port1), "bogus", "operationName", "invalid");
            fail("Should fail");
        } catch (CamelExecutionException e) {
            IllegalArgumentException fault = assertIsInstanceOf(IllegalArgumentException.class, e.getCause());

            log.info("reason = {}", fault.getMessage());
        }
    }
}
