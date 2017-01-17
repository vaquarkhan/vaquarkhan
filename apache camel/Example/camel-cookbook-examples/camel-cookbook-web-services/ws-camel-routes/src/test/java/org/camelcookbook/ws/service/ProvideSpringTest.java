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

package org.camelcookbook.ws.service;

import org.apache.camel.test.AvailablePortFinder;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.ws.payment_service.types.TransferRequest;
import org.camelcookbook.ws.payment_service.types.TransferResponse;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ProvideSpringTest extends CamelSpringTestSupport {
    private final int port1 = AvailablePortFinder.getNextAvailable();

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        System.setProperty("port1", String.valueOf(port1));

        return new ClassPathXmlApplicationContext("META-INF/spring/service-context.xml");
    }

    @Test
    public void testProvideSpring() {
        TransferRequest request = new TransferRequest();
        request.setBank("Bank of Camel");
        request.setFrom("Jakub");
        request.setTo("Scott");
        request.setAmount("1");

        TransferResponse response = template.requestBody(String.format("cxf:http://localhost:%d/paymentService?serviceClass=org.camelcookbook.ws.payment_service.Payment", port1), request, TransferResponse.class);

        assertNotNull(response);
        assertEquals("OK", response.getReply());
    }
}
