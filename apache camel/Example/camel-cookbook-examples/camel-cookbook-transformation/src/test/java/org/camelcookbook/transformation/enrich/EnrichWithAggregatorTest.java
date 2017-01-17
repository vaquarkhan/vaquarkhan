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

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.JndiRegistry;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

public class EnrichWithAggregatorTest extends CamelTestSupport {

    @Override
    protected RouteBuilder[] createRouteBuilders() throws Exception {
        EnrichWithAggregatorRouteBuilder routeBuilder = new EnrichWithAggregatorRouteBuilder();
        routeBuilder.setMyMerger(context().getRegistry().lookupByNameAndType("myMerger", MergeInReplacementText.class));

        return new RouteBuilder[]{routeBuilder, new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:expander")
                    .bean(AbbreviationExpander.class, "expand");
            }
        }};
    }

    @Override
    protected JndiRegistry createRegistry() throws Exception {
        JndiRegistry jndiRegistry = super.createRegistry();

        // register beanId for use by EnrichRouteBuilder
        // you could also use Spring or Blueprint 'bean' to create and configure
        // these references where the '<bean id="<ref id>">'
        jndiRegistry.bind("myMerger", new MergeInReplacementText());

        return jndiRegistry;
    }

    @Test
    public void testEnrichWithAggregator() throws Exception {
        String response = template.requestBody("direct:start", "Hello MA", String.class);

        assertEquals("Hello Massachusetts", response);

        response = template.requestBody("direct:start", "I like CA", String.class);

        assertEquals("I like California", response);
    }
}
