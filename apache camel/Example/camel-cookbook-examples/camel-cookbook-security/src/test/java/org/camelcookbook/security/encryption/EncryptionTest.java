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

import java.security.Key;
import java.security.KeyStore;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Demonstrates the use of a shared secret key to encrypt and decrypt a message.
 */
public class EncryptionTest extends CamelTestSupport {
    private final Logger log = LoggerFactory.getLogger(EncryptionTest.class);

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("JCEKS");

        ClassLoader classLoader = getClass().getClassLoader();
        log.info("Loading keystore from [{}]", classLoader.getResource("shared.jceks").toString());
        keyStore.load(classLoader.getResourceAsStream("shared.jceks"), "sharedKeystorePassword".toCharArray());

        Key sharedKey = keyStore.getKey("shared", "sharedKeyPassword".toCharArray());
        return new EncryptionRouteBuilder(sharedKey);
    }

    @Test
    public void testMessageEncryption() throws InterruptedException {
        MockEndpoint mockDecrypted = getMockEndpoint("mock:decrypted");
        mockDecrypted.setExpectedMessageCount(1);
        mockDecrypted.message(0).body().isEqualTo("foo");

        template.sendBody("direct:encrypt", "foo");

        assertMockEndpointsSatisfied();
    }
}
