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

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the use of a shared secret key to encrypt and decrypt a message.
 */
public class EncryptionSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/encryption-context.xml");
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
