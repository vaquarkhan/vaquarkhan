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

package org.camelcookbook.structuringroutes.routecontrol;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;

/**
 * Processor class that turns off a named route.
 */
public class RouteStoppingProcessor implements Processor {
    @Override
    public void process(Exchange exchange) throws Exception {
        final String routeName = exchange.getIn().getBody(String.class);
        final CamelContext context = exchange.getContext();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    context.stopRoute(routeName);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }).start();
    }
}
