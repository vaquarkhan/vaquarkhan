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

package org.camelcookbook.transformation.enrich;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;
import org.apache.commons.lang.Validate;

public class MergeInReplacementText implements AggregationStrategy {
    public static final String ENRICH_EXAMPLE_ORIGINAL_BODY = "EnrichExample.originalBody";
    public static final String ENRICH_EXAMPLE_REPLACEMENT_STRING = "EnrichExample.replacementString";

    /**
     * When using this AggregationStrategy, this method must be called <b>before</b> the enrich call as this
     * method sets up the message body, and adds some properties needed by the aggregate method.
     */
    public void setup(Exchange exchange) {
        final String originalBody = exchange.getIn().getBody(String.class);

        exchange.setProperty(ENRICH_EXAMPLE_ORIGINAL_BODY, originalBody);

        final String enrichParameter = originalBody.substring(originalBody.lastIndexOf(" ") + 1);

        exchange.setProperty(ENRICH_EXAMPLE_REPLACEMENT_STRING, enrichParameter);

        exchange.getIn().setBody(enrichParameter);
    }

    @Override
    public Exchange aggregate(Exchange original, Exchange enrichResponse) {
        // The original.In.Body was changed to the replacement string, so need to retrieve property with original body
        final String originalBody = original.getProperty(ENRICH_EXAMPLE_ORIGINAL_BODY, String.class);
        Validate.notEmpty(originalBody,
            "The property '" + ENRICH_EXAMPLE_ORIGINAL_BODY + "' must be set with the original message body.");

        final String replacementString = original.getProperty(ENRICH_EXAMPLE_REPLACEMENT_STRING, String.class);
        Validate.notEmpty(replacementString,
            "The property '" + ENRICH_EXAMPLE_REPLACEMENT_STRING + "' must be set with the value to be replaced.");

        final String replacementValue = enrichResponse.getIn().getBody(String.class);

        // Use regular expression to replace the last occurrence of the replacement string
        final String mergeResult = originalBody.replaceAll(replacementString + "$", replacementValue);

        original.getIn().setBody(mergeResult);

        return original;
    }
}
