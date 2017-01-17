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

package org.camelcookbook.routing.dynamicrouter;

import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyDynamicRouter {
    private static final Logger LOG = LoggerFactory.getLogger(MyDynamicRouter.class);

    private static final String PROPERTY_NAME_INVOKED = "invoked";

    /**
     * Returns the next endpoint to route a message to or null to finish routing.
     * This implementation leverages Camel's
     * <a href="http://camel.apache.org/bean-integration.html">Bean injection</a>
     * to pass parts of the Camel Exchange to the method for processing. This can
     * help the code be easier to maintain as it does not need the extra boilerplate
     * code for extracting the relative data from the Exchange.
     * <p></p>
     * This implementation stores an int property with the message exchange that is
     * used to drive the routing behavior. This method will be called from multiple
     * threads, one per message, so storing message specific state as a property is
     * a good strategy.
     *
     * @param body       the IN message converted to a String using Camel Bean injection
     * @param properties the properties map associated with the Camel Exchange
     * @return next endpoint uri(s) to route to or <tt>null</tt> to finish routing
     */
    public String routeMe(String body, @Properties Map<String, Object> properties) {
        LOG.info("Exchange.SLIP_ENDPOINT = {}, invoked = {}",
            properties.get(Exchange.SLIP_ENDPOINT), properties.get(PROPERTY_NAME_INVOKED));

        // Store a property with the message exchange that will drive the routing
        // decisions of this Dynamic Router implementation.
        int invoked = 0;
        Object current = properties.get(PROPERTY_NAME_INVOKED); // property will be null on first call
        if (current != null) {
            invoked = Integer.valueOf(current.toString());
        }
        invoked++;
        properties.put(PROPERTY_NAME_INVOKED, invoked);

        if (invoked == 1) {
            return "mock:a";
        } else if (invoked == 2) {
            return "mock:b,mock:c";
        } else if (invoked == 3) {
            return "direct:other";
        } else if (invoked == 4) {
            return "mock:result";
        }

        // no more, so return null
        return null;
    }
}
