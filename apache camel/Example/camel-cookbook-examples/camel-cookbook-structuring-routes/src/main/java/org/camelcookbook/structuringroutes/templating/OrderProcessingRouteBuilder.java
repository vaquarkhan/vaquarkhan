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

package org.camelcookbook.structuringroutes.templating;

import javax.annotation.PostConstruct;

import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.lang.Validate;

public class OrderProcessingRouteBuilder extends RouteBuilder {
    String id;
    String inputUri;
    String outputUri;
    private OrderFileNameProcessor orderFileNameProcessor;

    public void setId(String id) {
        this.id = id;
    }

    public void setInputDirectory(String inputDirectory) {
        inputUri = "file://" + inputDirectory;
    }

    public void setOutputDirectory(String outputDirectory) {
        outputUri = "file://" + outputDirectory;
    }

    public void setOrderFileNameProcessor(OrderFileNameProcessor orderFileNameProcessor) {
        this.orderFileNameProcessor = orderFileNameProcessor;
    }

    @PostConstruct
    public void checkMandatoryProperties() {
        Validate.notEmpty(inputUri, "inputUri is empty");
        Validate.notEmpty(outputUri, "outputUri is empty");
        Validate.notNull(orderFileNameProcessor, "orderFileNameProcessor is null");
    }

    @Override
    public void configure() throws Exception {
        from(inputUri)
            .id(id)
            .split(bodyAs(String.class).tokenize("\n")) // split into individual lines
                .process(orderFileNameProcessor)
                .log("Writing file: ${header.CamelFileName}")
                .to(outputUri)
            .end();
    }
}
