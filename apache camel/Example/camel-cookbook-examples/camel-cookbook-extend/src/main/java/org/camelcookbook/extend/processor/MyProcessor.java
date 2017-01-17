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

package org.camelcookbook.extend.processor;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;

public class MyProcessor implements Processor {
    @Override
    public void process(Exchange exchange) throws Exception {
        String result = "Unknown language";

        final Message inMessage = exchange.getIn();
        final String body = inMessage.getBody(String.class);
        final String language = inMessage.getHeader("language", String.class);

        if ("en".equals(language)) {
            result = "Hello " + body;
        } else if ("fr".equals(language)) {
            result = "Bonjour " + body;
        }

        inMessage.setBody(result);
    }
}
