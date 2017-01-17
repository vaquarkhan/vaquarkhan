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

package org.camelcookbook.transformation.json;

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class JsonSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/json-context.xml");
    }

    @Test
    public void testJsonSpringMarshal() throws Exception {
        View view = new View();

        view.setAge(29);
        view.setHeight(46);
        view.setWeight(34);

        String response = template.requestBody("direct:marshal", view, String.class);

        log.info(response);
        assertEquals("{\"org.camelcookbook.transformation.json.View\":{\"age\":29,\"weight\":34,\"height\":46}}", response);
    }

    @Test
    public void testJsonSpringUnmarshal() throws Exception {
        final String request = "{\"org.camelcookbook.transformation.json.View\":{\"age\":29,\"weight\":34,\"height\":46}}";

        View response = template.requestBody("direct:unmarshal", request, View.class);

        View view = new View();

        view.setAge(29);
        view.setHeight(46);
        view.setWeight(34);

        assertEquals(view, response);
    }
}
