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

package org.camelcookbook.examples.testing.dataset;

import org.apache.camel.Exchange;
import org.apache.camel.component.dataset.DataSetSupport;

/**
 * Data set used to generate incoming messages.
 */
public class InputDataSet extends DataSetSupport {
    @Override
    protected Object createMessageBody(long messageIndex) {
        return "message " + messageIndex;
    }

    @Override
    protected void applyHeaders(Exchange exchange, long messageIndex) {
        exchange.getIn().setHeader("mySequenceId", messageIndex);
    }
}
