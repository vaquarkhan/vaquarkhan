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

package org.camelcookbook.structuringroutes.seda;

import org.apache.camel.builder.RouteBuilder;

public class SedaTimerRouteBuilder extends RouteBuilder {
    public final static int TIMER_PERIOD = 200;

    @Override
    public void configure() throws Exception {
        from("timer:ping?period=" + TIMER_PERIOD).startupOrder(2)
            .transform(constant("Ping"))
            .to("seda:longRunningPhase");

        from("seda:longRunningPhase?concurrentConsumers=15").startupOrder(1)
            .process(new LongRunningProcessor())
            .to("mock:out");
    }
}
