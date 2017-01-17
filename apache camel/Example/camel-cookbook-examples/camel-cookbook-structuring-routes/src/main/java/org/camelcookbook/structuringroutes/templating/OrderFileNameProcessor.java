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

package org.camelcookbook.structuringroutes.templating;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.commons.lang.StringUtils;

/**
 * Processor class that takes a line of CSV as an input on the Exchange:
 * <ol>
 *   <li>gets the first field,</li>
 *   <li>parses it according to a country-specific date format</li>
 *   <li>sets the CamelFileName header to the date the file should be written to</li>
 *   <li>changes the first field to the universal one.</li>
 * </ol>
 */
public class OrderFileNameProcessor implements Processor {

    /**
     * See http://xkcd.com/1179/
     */
    public final static String UNIVERSAL_DATE_FORMAT = "yyyy-MM-dd";

    public String countryDateFormat;

    public void setCountryDateFormat(String countryDateFormat) {
        this.countryDateFormat = countryDateFormat;
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        Message in = exchange.getIn();

        // there are better way to handle CSV files, but this is OK as an example
        String[] fields = in.getBody(String.class).split(",");
        String countrySpecificDate = fields[0];

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(countryDateFormat);
        Date date = simpleDateFormat.parse(countrySpecificDate);

        SimpleDateFormat universalDateFormat = new SimpleDateFormat(UNIVERSAL_DATE_FORMAT);
        String universalDate = universalDateFormat.format(date);
        fields[0] = universalDate;

        in.setHeader("CamelFileName", universalDate + ".csv");
        in.setBody(StringUtils.join(fields, ","));
    }
}
