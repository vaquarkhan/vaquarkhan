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

package org.camelcookbook.transformation.jaxb;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.transformation.myschema.Book;
import org.camelcookbook.transformation.myschema.Bookstore;
import org.junit.Test;

public class JaxbTest extends CamelTestSupport {

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new JaxbRouteBuilder();
    }

    @Test
    public void testJaxbMarshal() throws Exception {
        Bookstore bookstore = new Bookstore();

        Book book = new Book();

        Book.Title title = new Book.Title();
        title.setValue("Apache Camel Developer's Cookbook");

        book.setTitle(title);
        book.setYear(2013);
        book.setPrice(39.99);
        book.getAuthor().add("Scott Cranton");
        book.getAuthor().add("Jakub Korab");

        bookstore.getBook().add(book);

        String response = template.requestBody("direct:marshal", bookstore, String.class);

        log.info(response);
        assertEquals("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
            "<bookstore>\n" +
            "    <book>\n" +
            "        <title>Apache Camel Developer's Cookbook</title>\n" +
            "        <author>Scott Cranton</author>\n" +
            "        <author>Jakub Korab</author>\n" +
            "        <year>2013</year>\n" +
            "        <price>39.99</price>\n" +
            "    </book>\n" +
            "</bookstore>\n", response);
    }

    @Test
    public void testJaxbUnmarshal() throws Exception {
        final String request = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
            "<bookstore>\n" +
            "    <book>\n" +
            "        <title>Apache Camel Developer's Cookbook</title>\n" +
            "        <author>Scott Cranton</author>\n" +
            "        <author>Jakub Korab</author>\n" +
            "        <year>2013</year>\n" +
            "        <price>39.99</price>\n" +
            "    </book>\n" +
            "</bookstore>\n";

        Bookstore response = template.requestBody("direct:unmarshal", request, Bookstore.class);

        Bookstore bookstore = new Bookstore();

        Book book = new Book();

        Book.Title title = new Book.Title();
        title.setValue("Apache Camel Developer's Cookbook");

        book.setTitle(title);
        book.setYear(2013);
        book.setPrice(39.99);
        book.getAuthor().add("Scott Cranton");
        book.getAuthor().add("Jakub Korab");

        bookstore.getBook().add(book);

        assertEquals(bookstore, response);
    }
}
