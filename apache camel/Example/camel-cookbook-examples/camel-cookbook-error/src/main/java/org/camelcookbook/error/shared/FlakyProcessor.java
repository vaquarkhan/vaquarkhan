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

package org.camelcookbook.error.shared;

import org.apache.camel.Exchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FlakyProcessor {
    private final static Logger LOG = LoggerFactory.getLogger(FlakyProcessor.class);

    public void doSomething(Exchange exchange) throws FlakyException {
        if (exchange.getProperty("optimizeBit", false, boolean.class)) {
            LOG.info("FlakyProcessor works with optimizationBit set");
            return;
        }

        if ("KaBoom".equalsIgnoreCase(exchange.getIn().getBody(String.class))) {
            LOG.error("Throwing FlakyException");
            throw new FlakyException("FlakyProcessor has gone Flaky");
        }
    }
}
