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

package org.camelcookbook.transformation.normalizer;

import java.io.InputStream;
import java.util.Locale;

import org.apache.camel.Exchange;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.transformation.myschema.Book;
import org.camelcookbook.transformation.myschema.Bookstore;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class NormalizerSpringTest extends CamelSpringTestSupport {

    @Override
    public void doPreSetup() throws Exception {
        super.doPreSetup();
        Locale.setDefault(Locale.US);
    }

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/normalizer-context.xml");
    }

    @Test
    public void testNormalizeXml() throws Exception {
        final InputStream resource = getClass().getClassLoader().getResourceAsStream("bookstore.xml");
        final String request = context().getTypeConverter().convertTo(String.class, resource);

        getMockEndpoint("mock:unknown").setExpectedMessageCount(0);
        getMockEndpoint("mock:csv").setExpectedMessageCount(0);
        getMockEndpoint("mock:json").setExpectedMessageCount(0);

        getMockEndpoint("mock:xml").expectedBodiesReceived(getExpectedBookstore());
        getMockEndpoint("mock:normalized").expectedBodiesReceived(getExpectedBookstore());

        template.sendBodyAndHeader("direct:start", request, Exchange.FILE_NAME, "bookstore.xml");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testNormalizeJson() throws Exception {
        final InputStream resource = getClass().getClassLoader().getResourceAsStream("bookstore.json");
        final String request = context().getTypeConverter().convertTo(String.class, resource);

        getMockEndpoint("mock:unknown").setExpectedMessageCount(0);
        getMockEndpoint("mock:csv").setExpectedMessageCount(0);
        getMockEndpoint("mock:xml").setExpectedMessageCount(0);

        getMockEndpoint("mock:json").expectedBodiesReceived(getExpectedBookstore());
        getMockEndpoint("mock:normalized").expectedBodiesReceived(getExpectedBookstore());

        template.sendBodyAndHeader("direct:start", request, Exchange.FILE_NAME, "bookstore.json");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testNormalizeCsv() throws Exception {
        final InputStream resource = getClass().getClassLoader().getResourceAsStream("bookstore.csv");
        final String request = context().getTypeConverter().convertTo(String.class, resource);

        getMockEndpoint("mock:unknown").setExpectedMessageCount(0);
        getMockEndpoint("mock:json").setExpectedMessageCount(0);
        getMockEndpoint("mock:xml").setExpectedMessageCount(0);

        getMockEndpoint("mock:csv").expectedBodiesReceived(getExpectedBookstore());
        getMockEndpoint("mock:normalized").expectedBodiesReceived(getExpectedBookstore());

        template.sendBodyAndHeader("direct:start", request, Exchange.FILE_NAME, "bookstore.csv");

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testNormalizeUnknown() throws Exception {
        getMockEndpoint("mock:csv").setExpectedMessageCount(0);
        getMockEndpoint("mock:json").setExpectedMessageCount(0);
        getMockEndpoint("mock:xml").setExpectedMessageCount(0);
        getMockEndpoint("mock:normalized").setExpectedMessageCount(0);

        final MockEndpoint mockUnknown = getMockEndpoint("mock:unknown");
        mockUnknown.expectedBodiesReceived("Unknown Data");
        mockUnknown.expectedHeaderReceived(Exchange.FILE_NAME, "bookstore.unknown");

        template.sendBodyAndHeader("direct:start", "Unknown Data", Exchange.FILE_NAME, "bookstore.unknown");

        assertMockEndpointsSatisfied();
    }

    protected Bookstore getExpectedBookstore() {
        final Bookstore bookstore = new Bookstore();

        Book book = new Book();

        book.setCategory("COOKING");

        Book.Title title = new Book.Title();
        title.setValue("Everyday Italian");
        title.setLang("en");

        book.setTitle(title);
        book.getAuthor().add("Giada De Laurentiis");
        book.setYear(2005);
        book.setPrice(30.00);

        bookstore.getBook().add(book);

        book = new Book();

        book.setCategory("CHILDREN");

        title = new Book.Title();
        title.setValue("Harry Potter");
        title.setLang("en");

        book.setTitle(title);
        book.getAuthor().add("J K. Rowling");
        book.setYear(2005);
        book.setPrice(29.99);

        bookstore.getBook().add(book);

        book = new Book();

        book.setCategory("WEB");

        title = new Book.Title();
        title.setValue("Learning XML");
        title.setLang("en");

        book.setTitle(title);
        book.getAuthor().add("Erik T. Ray");
        book.setYear(2003);
        book.setPrice(39.95);

        bookstore.getBook().add(book);

        book = new Book();

        book.setCategory("PROGRAMMING");

        title = new Book.Title();
        title.setValue("Apache Camel Developer's Cookbook");
        title.setLang("en");

        book.setTitle(title);
        book.getAuthor().add("Scott Cranton");
        book.getAuthor().add("Jakub Korab");
        book.setYear(2013);
        book.setPrice(49.99);

        bookstore.getBook().add(book);

        return bookstore;
    }
}
