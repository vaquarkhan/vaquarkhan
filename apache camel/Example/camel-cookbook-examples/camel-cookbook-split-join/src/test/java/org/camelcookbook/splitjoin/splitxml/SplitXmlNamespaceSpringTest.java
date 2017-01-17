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

package org.camelcookbook.splitjoin.splitxml;

import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the splitting of Xml files through XPath expression using Namespaces.
 * <p/>
 * This test is intended to be run out of Maven, as it references the target directory.
 */
public class SplitXmlNamespaceSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("/META-INF/spring/splitXmlNamespace-context.xml");
    }

    @Test
    public void testSplitArray() throws Exception {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.expectedMessageCount(2);
        mockOut.expectedBodiesReceived("Scott Cranton", "Jakub Korab");

        String filename = "target/classes/xml/books-ns.xml";
        assertFileExists(filename);
        InputStream booksStream = new FileInputStream(filename);

        template.sendBody("direct:in", booksStream);

        assertMockEndpointsSatisfied();
    }
}
