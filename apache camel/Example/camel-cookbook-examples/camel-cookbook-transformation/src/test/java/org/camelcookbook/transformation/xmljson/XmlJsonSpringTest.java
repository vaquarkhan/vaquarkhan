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

package org.camelcookbook.transformation.xmljson;

import java.io.InputStream;

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class XmlJsonSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/xmljson-context.xml");
    }

    @Test
    public void testXmlJsonSpringMarshal() throws Exception {
        final InputStream resource = getClass().getClassLoader().getResourceAsStream("bookstore.xml");
        final String request = context().getTypeConverter().convertTo(String.class, resource);

        final String response = template.requestBody("direct:marshal", request, String.class);

        log.info(response);
        assertEquals("[" +
            "{\"@category\":\"COOKING\",\"title\":{\"@lang\":\"en\",\"#text\":\"Everyday Italian\"},\"author\":\"Giada De Laurentiis\",\"year\":\"2005\",\"price\":\"30.00\"}," +
            "{\"@category\":\"CHILDREN\",\"title\":{\"@lang\":\"en\",\"#text\":\"Harry Potter\"},\"author\":\"J K. Rowling\",\"year\":\"2005\",\"price\":\"29.99\"}," +
            "{\"@category\":\"WEB\",\"title\":{\"@lang\":\"en\",\"#text\":\"Learning XML\"},\"author\":\"Erik T. Ray\",\"year\":\"2003\",\"price\":\"39.95\"}," +
            "{\"@category\":\"PROGRAMMING\",\"title\":{\"@lang\":\"en\",\"#text\":\"Apache Camel Developer's Cookbook\"},\"author\":[\"Scott Cranton\",\"Jakub Korab\"],\"year\":\"2013\",\"price\":\"49.99\"}" +
            "]",
            response);
    }

    @Test
    public void testXmlJsonSpringUnmarshal() throws Exception {
        final String request = "[" +
            "{\"@category\":\"COOKING\",\"title\":{\"@lang\":\"en\",\"#text\":\"Everyday Italian\"},\"author\":\"Giada De Laurentiis\",\"year\":\"2005\",\"price\":\"30.00\"}," +
            "{\"@category\":\"CHILDREN\",\"title\":{\"@lang\":\"en\",\"#text\":\"Harry Potter\"},\"author\":\"J K. Rowling\",\"year\":\"2005\",\"price\":\"29.99\"}," +
            "{\"@category\":\"WEB\",\"title\":{\"@lang\":\"en\",\"#text\":\"Learning XML\"},\"author\":\"Erik T. Ray\",\"year\":\"2003\",\"price\":\"39.95\"}," +
            "{\"@category\":\"PROGRAMMING\",\"title\":{\"@lang\":\"en\",\"#text\":\"Apache Camel Developer's Cookbook\"},\"author\":[\"Scott Cranton\",\"Jakub Korab\"],\"year\":\"2013\",\"price\":\"49.99\"}" +
            "]";

        final String response = template.requestBody("direct:unmarshal", request, String.class);

        log.info(response);
        assertEquals("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" +
            "<a>" +
            "<e category=\"COOKING\"><author>Giada De Laurentiis</author><price>30.00</price><title lang=\"en\">Everyday Italian</title><year>2005</year></e>" +
            "<e category=\"CHILDREN\"><author>J K. Rowling</author><price>29.99</price><title lang=\"en\">Harry Potter</title><year>2005</year></e>" +
            "<e category=\"WEB\"><author>Erik T. Ray</author><price>39.95</price><title lang=\"en\">Learning XML</title><year>2003</year></e>" +
            "<e category=\"PROGRAMMING\"><author><e>Scott Cranton</e><e>Jakub Korab</e></author><price>49.99</price><title lang=\"en\">Apache Camel Developer's Cookbook</title><year>2013</year></e>" +
            "</a>\r\n", response);
    }

    @Test
    public void testXmlJsonSpringUnmarshalBookstore() throws Exception {
        final String request = "[" +
            "{\"@category\":\"COOKING\",\"title\":{\"@lang\":\"en\",\"#text\":\"Everyday Italian\"},\"author\":\"Giada De Laurentiis\",\"year\":\"2005\",\"price\":\"30.00\"}," +
            "{\"@category\":\"CHILDREN\",\"title\":{\"@lang\":\"en\",\"#text\":\"Harry Potter\"},\"author\":\"J K. Rowling\",\"year\":\"2005\",\"price\":\"29.99\"}," +
            "{\"@category\":\"WEB\",\"title\":{\"@lang\":\"en\",\"#text\":\"Learning XML\"},\"author\":\"Erik T. Ray\",\"year\":\"2003\",\"price\":\"39.95\"}," +
            "{\"@category\":\"PROGRAMMING\",\"title\":{\"@lang\":\"en\",\"#text\":\"Apache Camel Developer's Cookbook\"},\"author\":[\"Scott Cranton\",\"Jakub Korab\"],\"year\":\"2013\",\"price\":\"49.99\"}" +
            "]";

        final String response = template.requestBody("direct:unmarshalBookstore", request, String.class);

        log.info(response);
        assertEquals("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" +
            "<bookstore>" +
            "<book category=\"COOKING\"><author>Giada De Laurentiis</author><price>30.00</price><title lang=\"en\">Everyday Italian</title><year>2005</year></book>" +
            "<book category=\"CHILDREN\"><author>J K. Rowling</author><price>29.99</price><title lang=\"en\">Harry Potter</title><year>2005</year></book>" +
            "<book category=\"WEB\"><author>Erik T. Ray</author><price>39.95</price><title lang=\"en\">Learning XML</title><year>2003</year></book>" +
            "<book category=\"PROGRAMMING\"><author>Scott Cranton</author><author>Jakub Korab</author><price>49.99</price><title lang=\"en\">Apache Camel Developer's Cookbook</title><year>2013</year></book>" +
            "</bookstore>\r\n", response);
    }
}
