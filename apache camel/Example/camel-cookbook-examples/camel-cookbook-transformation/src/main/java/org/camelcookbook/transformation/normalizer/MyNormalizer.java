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

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import org.camelcookbook.transformation.csv.model.BookModel;
import org.camelcookbook.transformation.myschema.Book;
import org.camelcookbook.transformation.myschema.Bookstore;

public class MyNormalizer {
    public Bookstore bookModelToJaxb(List<BookModel> books) {
        final Bookstore bookstore = new Bookstore();

        final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");

        for (BookModel bookModel : books) {
            final Book book = new Book();
            final Book.Title title = new Book.Title();

            book.setCategory(bookModel.getCategory());

            title.setLang(bookModel.getTitleLanguage());
            title.setValue(bookModel.getTitle());
            book.setTitle(title);

            book.getAuthor().add(bookModel.getAuthor1());

            final String author2 = bookModel.getAuthor2();
            if ((author2 != null) && !author2.isEmpty()) {
                book.getAuthor().add(author2);
            }

            book.setYear(Integer.parseInt(simpleDateFormat.format(bookModel.getPublishDate())));
            book.setPrice(bookModel.getPrice().doubleValue());

            bookstore.getBook().add(book);
        }

        return bookstore;
    }
}
