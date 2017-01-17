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

package org.camelcookbook.monitoring.monitor;

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jmx.JMXUriBuilder;

public class MonitorRouteBuilder extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("direct:start")
                .routeId("monitorRoute")
            .transform(simple("Monitoring ${body}"))
            .log("${body}")
            .to("mock:result");

        //
        // Use convenience JMXUriBuilder to help create jmx uri with all
        // of the correct parameters and formatting
        //

        Map<String, String> map = new HashMap<String, String>();
        map.put("context", "localhost/" + getContext().getName());
        map.put("type", "routes");
        map.put("name", "\"monitorRoute\"");

        JMXUriBuilder jmxUriBuilder = new JMXUriBuilder("platform")
            .withObjectDomain("org.apache.camel")
            .withObjectProperties(map)
            .withMonitorType("counter")
            .withObservedAttribute("ExchangesCompleted")
            .withInitThreshold(0)
            .withGranularityPeriod(500)
            .withOffset(1)
            .withDifferenceMode(false);

        log.info("jmxUri = {}", jmxUriBuilder.toString());

        from(jmxUriBuilder.toString())
                .routeId("jmxMonitor")
            .log("${body}")
            .to("mock:monitor");
    }
}
