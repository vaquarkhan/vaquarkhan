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

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.camelcookbook.transformation.csv.model.BookModel;
import org.camelcookbook.transformation.myschema.Book;
import org.camelcookbook.transformation.myschema.Bookstore;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class MyNormalizerTest {

    @Before
    public void setupLocale() throws Exception {
        Locale.setDefault(Locale.US);
    }

    @Test
    public void testBookModelToJaxb() throws Exception {
        final MyNormalizer myNormalizer = new MyNormalizer();

        final List<BookModel> books = createCsvModel();

        final Bookstore result = myNormalizer.bookModelToJaxb(books);

        assertEquals(createJaxbModel(), result);
    }

    protected List<BookModel> createCsvModel() throws ParseException {
        final List<BookModel> books = new ArrayList<>();

        final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MMM-yyyy");

        BookModel book = new BookModel();
        book.setCategory("PROGRAMMING");
        book.setTitle("Apache Camel Developer's Cookbook");
        book.setTitleLanguage("en");
        book.setAuthor1("Scott Cranton");
        book.setAuthor2("Jakub Korab");
        book.setPublishDate(simpleDateFormat.parse("Dec-2013"));
        book.setPrice(BigDecimal.valueOf(49.99));

        books.add(book);

        return books;
    }

    protected Bookstore createJaxbModel() {
        final Bookstore bookstore = new Bookstore();

        Book book = new Book();

        book.setCategory("PROGRAMMING");

        Book.Title title = new Book.Title();
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
