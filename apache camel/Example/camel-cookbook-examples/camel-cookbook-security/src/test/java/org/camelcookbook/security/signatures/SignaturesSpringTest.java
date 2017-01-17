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

package org.camelcookbook.security.signatures;

import java.security.SignatureException;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the use of public and private keys to digitally sign a message payload.
 */
public class SignaturesSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/signatures-context.xml");
    }

    @Test
    public void testMessageSigning() throws InterruptedException {
        MockEndpoint mockVerified = getMockEndpoint("mock:verified");
        mockVerified.setExpectedMessageCount(1);

        template.sendBody("direct:sign", "foo");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testMessageModificationAfterSigning() throws InterruptedException {
        MockEndpoint mockSigned = getMockEndpoint("mock:signed");
        mockSigned.whenAnyExchangeReceived(new Processor() {
            @Override
            public void process(Exchange exchange) throws Exception {
                Message in = exchange.getIn();
                in.setBody(in.getBody(String.class) + "modified");
            }
        });

        MockEndpoint mockVerified = getMockEndpoint("mock:verified");
        mockVerified.setExpectedMessageCount(0);

        try {
            template.sendBody("direct:sign", "foo");
            fail();
        } catch (CamelExecutionException cex) {
            assertTrue(ExceptionUtils.getRootCause(cex) instanceof SignatureException);
            assertEquals("SignatureException: Cannot verify signature of exchange",
                ExceptionUtils.getRootCauseMessage(cex));
        }

        assertMockEndpointsSatisfied();
    }
}
