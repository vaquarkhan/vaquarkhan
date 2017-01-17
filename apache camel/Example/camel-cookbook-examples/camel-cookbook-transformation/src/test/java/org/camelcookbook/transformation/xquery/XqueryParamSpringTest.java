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

package org.camelcookbook.transformation.xquery;

import java.io.InputStream;

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class XqueryParamSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/xquery-param-context.xml");
    }

    @Test
    public void testXqueryParamSpring() throws Exception {
        final InputStream resource = getClass().getClassLoader().getResourceAsStream("bookstore.xml");
        final String request = context().getTypeConverter().convertTo(String.class, resource);

        String response = template.requestBodyAndHeader("direct:start", request, "myParamValue", 30, String.class);

        log.info("Response > 30 = {}", response);
        assertEquals("<books value=\"30\"><title lang=\"en\">Apache Camel Developer's Cookbook</title><title lang=\"en\">Learning XML</title></books>", response);

        response = template.requestBodyAndHeader("direct:start", request, "myParamValue", 40, String.class);

        log.info("Response > 40 = {}", response);
        assertEquals("<books value=\"40\"><title lang=\"en\">Apache Camel Developer's Cookbook</title></books>", response);
    }
}
