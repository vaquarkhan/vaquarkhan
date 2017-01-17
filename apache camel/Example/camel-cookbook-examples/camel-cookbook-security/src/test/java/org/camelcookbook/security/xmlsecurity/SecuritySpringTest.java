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

package org.camelcookbook.security.xmlsecurity;

import java.io.InputStream;

import org.apache.camel.builder.AdviceWithRouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SecuritySpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/xmlsecurity-context.xml");
    }

    @Override
    public boolean isUseAdviceWith() {
        return true;
    }

    @Test
    public void testXmlEncryptionDecryption() throws Exception {
        final String cityExistsXPath = "/booksignings/store/address/city";

        context.getRouteDefinition("encrypt")
            .adviceWith(context, new AdviceWithRouteBuilder() {
                @Override
                public void configure() throws Exception {
                    interceptSendToEndpoint("direct:decrypt")
                        .when(xpath(cityExistsXPath))
                            .to("mock:incorrectlyEncrypted");
                }
            });
        context.getRouteDefinition("decrypt")
            .adviceWith(context, new AdviceWithRouteBuilder() {
                @Override
                public void configure() throws Exception {
                    interceptSendToEndpoint("mock:out")
                        .when(xpath(cityExistsXPath))
                            .to("mock:correctlyDecrypted");
                }
            });
        context.start();

        MockEndpoint mockIncorrectlyEncrypted = getMockEndpoint("mock:incorrectlyEncrypted");
        mockIncorrectlyEncrypted.setExpectedMessageCount(0);
        MockEndpoint mockCorrectlyDecrypted = getMockEndpoint("mock:correctlyDecrypted");
        mockCorrectlyDecrypted.setExpectedMessageCount(1);
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);

        final InputStream resource = getClass().getClassLoader().getResourceAsStream("booklocations.xml");
        final String request = context().getTypeConverter().convertTo(String.class, resource);

        template.sendBody("direct:encrypt", request);
        assertMockEndpointsSatisfied();
    }
}
