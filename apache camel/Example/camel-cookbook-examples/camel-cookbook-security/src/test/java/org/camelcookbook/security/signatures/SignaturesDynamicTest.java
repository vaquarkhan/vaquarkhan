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

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Demonstrates the use of public and private keys to digitally sign a message payload.
 */
public class SignaturesDynamicTest extends CamelTestSupport {

    private final Logger log = LoggerFactory.getLogger(SignaturesDynamicTest.class);

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new SignaturesDynamicRouteBuilder();
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
        mockVerified.setExpectedMessageCount(2);

        template.sendBody("direct:sign_a", "foo");
        template.sendBody("direct:sign_b", "bar");

        assertMockEndpointsSatisfied();
    }
}
