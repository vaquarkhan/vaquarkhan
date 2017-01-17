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

package org.camelcookbook.security.encryption;

import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

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
 * Demonstrates the use of a shared secret key to encrypt and decrypt a message.
 */
public class EncryptionDynamicTest extends CamelTestSupport {

    private final Logger log = LoggerFactory.getLogger(EncryptionDynamicTest.class);

    @Override
    public CamelContext createCamelContext() throws KeyStoreException, CertificateException, NoSuchAlgorithmException, IOException, UnrecoverableKeyException {
        KeyStore keyStore = KeyStore.getInstance("JCEKS");

        ClassLoader classLoader = getClass().getClassLoader();
        log.info("Loading keystore from [{}]", classLoader.getResource("shared.jceks").toString());
        keyStore.load(classLoader.getResourceAsStream("shared.jceks"), "sharedKeystorePassword".toCharArray());

        SimpleRegistry registry = new SimpleRegistry();
        registry.put("shared_a", keyStore.getKey("shared_a", "sharedKeyPasswordA".toCharArray()));
        registry.put("shared_b", keyStore.getKey("shared_b", "sharedKeyPasswordB".toCharArray()));

        return new DefaultCamelContext(registry);
    }

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new EncryptionDynamicRouteBuilder();
    }

    @Test
    public void testDynamicDecryption() throws InterruptedException {
        MockEndpoint mockDecrypted = getMockEndpoint("mock:decrypted");
        mockDecrypted.setExpectedMessageCount(2);
        mockDecrypted.message(0).body().isEqualTo("foo_a");
        mockDecrypted.message(1).body().isEqualTo("foo_b");

        template.sendBodyAndHeader("direct:encrypt", "foo_a", "system", "a");
        template.sendBodyAndHeader("direct:encrypt", "foo_b", "system", "b");

        assertMockEndpointsSatisfied();
    }
}
