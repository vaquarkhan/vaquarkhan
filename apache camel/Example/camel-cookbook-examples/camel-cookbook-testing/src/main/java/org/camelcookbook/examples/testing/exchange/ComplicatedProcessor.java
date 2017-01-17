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

package org.camelcookbook.examples.testing.exchange;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;

/**
 * A complicated processor that uses the Camel Exchange API.
 */
public class ComplicatedProcessor implements Processor {


    @Override
    public void process(Exchange exchange) throws Exception {
        final String something = "SOMETHING";
        Message in = exchange.getIn();
        String action = in.getHeader("action", String.class);
        if ((action == null) || (action.isEmpty())) {
            in.setHeader("actionTaken", false);
        } else {
            in.setHeader("actionTaken", true);
            String body = in.getBody(String.class);
            if (action.equals("append")) {
                in.setBody(body + " " + something);
            } else if (action.equals("prepend")) {
                in.setBody(something + " " + body);
            } else {
                throw new IllegalArgumentException(
                    "Unrecognized action requested: [" + action + "]");
            }
        }
    }
}
