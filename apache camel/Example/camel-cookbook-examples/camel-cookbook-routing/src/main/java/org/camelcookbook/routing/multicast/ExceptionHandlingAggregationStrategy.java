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

package org.camelcookbook.routing.multicast;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Aggregation strategy that concatenates String mockreply.
 */
public class ExceptionHandlingAggregationStrategy implements AggregationStrategy {
    public static final String MULTICAST_EXCEPTION = "multicast_exception";

    private Logger logger = LoggerFactory.getLogger(ExceptionHandlingAggregationStrategy.class);

    @Override
    public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
        if (oldExchange == null) {
            if (newExchange.isFailed()) {
                // this block only gets called if stopOnException() is not defined on the multicast
                Exception ex = newExchange.getException();
                newExchange.setException(null);
                newExchange.setProperty(MULTICAST_EXCEPTION, ex);
            }
            return newExchange;
        } else {
            if (newExchange.isFailed()) {
                // this block only gets called if stopOnException() is not defined on the multicast
                Exception ex = newExchange.getException();
                oldExchange.setProperty(MULTICAST_EXCEPTION, ex);
            }
            // merge the Strings
            String body1 = oldExchange.getIn().getBody(String.class);
            String body2 = newExchange.getIn().getBody(String.class);
            String merged = (body1 == null) ? body2 : body1 + "," + body2;
            oldExchange.getIn().setBody(merged);
            return oldExchange;
        }

    }

}
