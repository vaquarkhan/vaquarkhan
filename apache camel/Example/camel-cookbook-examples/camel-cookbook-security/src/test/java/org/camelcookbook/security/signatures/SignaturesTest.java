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

import java.security.KeyStore;
import java.security.SignatureException;

import org.apache.camel.*;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.crypto.DigitalSignatureConstants;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Demonstrates the use of public and private keys to digitally sign a message payload.
 */
public class SignaturesTest extends CamelTestSupport {

    private final Logger log = LoggerFactory.getLogger(SignaturesTest.class);

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new SignaturesRouteBuilder();
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        final String keyStorePassword = "keystorePassword";
        final String trustStorePassword = "truststorePassword";

        SimpleRegistry registry = new SimpleRegistry();

        KeyStore keyStore = KeyStore.getInstance("JKS"); // Java keystore

        ClassLoader classLoader = getClass().getClassLoader();
        log.info("Loading keystore from [{}]", classLoader.getResource("keystore.jks").toString());
        keyStore.load(classLoader.getResourceAsStream("keystore.jks"), keyStorePassword.toCharArray());
        registry.put("keyStore", keyStore);

        KeyStore trustStore = KeyStore.getInstance("JKS"); // Java keystore
        trustStore.load(classLoader.getResourceAsStream("truststore.jks"), trustStorePassword.toCharArray());
        registry.put("trustStore", trustStore);

        return new DefaultCamelContext(registry);
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

    @Test
    public void testMessageSigningMissingKey() throws InterruptedException {
        MockEndpoint mockVerified = getMockEndpoint("mock:verified");
        mockVerified.setExpectedMessageCount(0);

        try {
            template.sendBodyAndHeader("direct:sign", "foo", DigitalSignatureConstants.KEYSTORE_ALIAS, "cheese");
            fail();
        } catch (CamelExecutionException cex) {
            assertTrue(ExceptionUtils.getRootCause(cex) instanceof IllegalStateException);
            String rootCauseMessage = ExceptionUtils.getRootCauseMessage(cex);
            assertTrue(rootCauseMessage.startsWith("IllegalStateException: Cannot sign message as no Private Key has been supplied."));
        }
    }

    @Test
    public void testMessageSigningMismatchedKeys() throws InterruptedException {
        MockEndpoint mockVerified = getMockEndpoint("mock:verified");
        mockVerified.setExpectedMessageCount(0);

        MockEndpoint mockSigned = getMockEndpoint("mock:signed");
        mockSigned.whenAnyExchangeReceived(new Processor() {

            @Override
            public void process(Exchange exchange) throws Exception {
                // let's override the key used by the verifying endpoint
                exchange.getIn().setHeader(DigitalSignatureConstants.KEYSTORE_ALIAS, "system_b");
            }
        });

        try {
            template.sendBody("direct:sign", "foo");
            fail();
        } catch (CamelExecutionException cex) {
            assertTrue(ExceptionUtils.getRootCause(cex) instanceof SignatureException);
            String rootCauseMessage = ExceptionUtils.getRootCauseMessage(cex);
            assertEquals("SignatureException: Cannot verify signature of exchange", rootCauseMessage);
        }
    }
}
