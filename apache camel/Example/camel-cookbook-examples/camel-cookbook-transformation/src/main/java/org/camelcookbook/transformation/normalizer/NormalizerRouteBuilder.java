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

import java.util.Arrays;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.converter.jaxb.JaxbDataFormat;
import org.apache.camel.dataformat.bindy.csv.BindyCsvDataFormat;
import org.apache.camel.dataformat.xmljson.XmlJsonDataFormat;
import org.apache.camel.spi.DataFormat;

public class NormalizerRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        final DataFormat bindy = new BindyCsvDataFormat(org.camelcookbook.transformation.csv.model.BookModel.class);
        final DataFormat jaxb = new JaxbDataFormat("org.camelcookbook.transformation.myschema");

        final XmlJsonDataFormat xmlJsonFormat = new XmlJsonDataFormat();
        xmlJsonFormat.setRootName("bookstore");
        xmlJsonFormat.setElementName("book");
        xmlJsonFormat.setExpandableProperties(Arrays.asList("author", "author"));

        from("direct:start")
            .choice()
            .when(header(Exchange.FILE_NAME).endsWith(".csv"))
                .unmarshal(bindy)
                .bean(MyNormalizer.class, "bookModelToJaxb")
                .to("mock:csv")
            .when(header(Exchange.FILE_NAME).endsWith(".json"))
                .unmarshal(xmlJsonFormat)
                .to("mock:json")
            .when(header(Exchange.FILE_NAME).endsWith(".xml"))
                .unmarshal(jaxb)
                .to("mock:xml")
            .otherwise()
                .to("mock:unknown")
                .stop()
            .end()
            .to("mock:normalized");
    }
}
