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

public class SporadicProcessor {
    private final static Logger LOG = LoggerFactory.getLogger(SporadicProcessor.class);

    private long lastCall;

    public void doSomething(Exchange exchange) throws SporadicException {
        if (exchange.getIn().getHeader(Exchange.REDELIVERED, false, boolean.class)) {
            exchange.setProperty("SporadicDelay", (System.currentTimeMillis() - lastCall));
            LOG.info("SporadicProcessor works on retry");
            return;
        }
        lastCall = System.currentTimeMillis();
        LOG.info("SporadicProcessor fails");
        throw new SporadicException("SporadicProcessor is unavailable");
    }
}
