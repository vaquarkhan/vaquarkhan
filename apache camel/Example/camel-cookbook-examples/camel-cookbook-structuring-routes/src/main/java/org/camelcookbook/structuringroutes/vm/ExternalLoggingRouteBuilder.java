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

package org.camelcookbook.structuringroutes.vm;

import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.lang.Validate;

/**
 * RouteBuilder that logs exchanges to a fictitious backend system. The endpoint scheme is
 * injected into this class to allow us to use it through VM and Direct-VM to highlight the differences.
 */
public class ExternalLoggingRouteBuilder extends RouteBuilder {
    public static final String LOG_MESSAGE_TO_BACKEND_SYSTEM = "logMessageToBackendSystem";
    public static final String LOGGING_THREAD_NAME = "logging.threadName";

    private final String logMessageSourceUri;

    public ExternalLoggingRouteBuilder(String endpointScheme) {
        Validate.notEmpty(endpointScheme, "endpointScheme is null or empty");
        this.logMessageSourceUri = endpointScheme + ":" + LOG_MESSAGE_TO_BACKEND_SYSTEM;
    }

    @Override
    public void configure() throws Exception {
        from(logMessageSourceUri)
            .setHeader(LOGGING_THREAD_NAME, simple("${threadName}"))
            .delay(1000)
            .log("Logged message to backend system ${body} by thread[${threadName}]")
            .setBody(simple("logging: ${body}"))
            .to("mock:out");
    }
}
