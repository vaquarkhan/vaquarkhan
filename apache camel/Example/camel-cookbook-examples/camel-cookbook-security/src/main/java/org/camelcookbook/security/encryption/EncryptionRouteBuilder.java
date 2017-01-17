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

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.converter.crypto.CryptoDataFormat;
import org.apache.commons.lang.Validate;

/**
 * Demonstrates the use of a shared secret key to encrypt and decrypt a message.
 */
public class EncryptionRouteBuilder extends RouteBuilder {

    private final Key sharedKey;

    public EncryptionRouteBuilder(Key sharedKey) {
        Validate.notNull(sharedKey, "sharedKey is null");
        this.sharedKey = sharedKey;
    }

    @Override
    public void configure() throws Exception {
        CryptoDataFormat sharedKeyCrypto = new CryptoDataFormat("DES", sharedKey);

        from("direct:encrypt")
            .log("Encrypting message")
            .marshal(sharedKeyCrypto)
            .log("Message encrypted: ${body}")
            .to("direct:decrypt");

        from("direct:decrypt")
            .log("Decrypting message")
            .unmarshal(sharedKeyCrypto)
            .log("Message decrypted: ${body}")
            .to("mock:decrypted");
    }
}