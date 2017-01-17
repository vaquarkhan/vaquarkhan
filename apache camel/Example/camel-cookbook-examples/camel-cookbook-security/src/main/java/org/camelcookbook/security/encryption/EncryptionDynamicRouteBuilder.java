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

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.converter.crypto.CryptoDataFormat;
import org.apache.camel.spi.Registry;

/**
 * Demonstrates the use of a shared secret key to encrypt and decrypt a message.
 */
public class EncryptionDynamicRouteBuilder extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        final CryptoDataFormat crypto = new CryptoDataFormat("DES", null);

        from("direct:encrypt")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    Registry registry = exchange.getContext().getRegistry();
                    Message in = exchange.getIn();
                    Key key = registry.lookupByNameAndType("shared_" + in.getHeader("system"), Key.class);
                    in.setHeader(CryptoDataFormat.KEY, key);
                }
            })
            .log("Encrypting message: ${body} using ${header[CamelCryptoKey]}")
            .marshal(crypto)
            .log("Message encrypted: ${body}")
            .to("direct:decrypt");

        from("direct:decrypt")
            .log("Decrypting message: ${body} using ${header[CamelCryptoKey]}")
            .unmarshal(crypto)
            .log("Message decrypted: ${body}")
            .to("mock:decrypted");
    }
}