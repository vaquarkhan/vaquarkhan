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

package org.camelcookbook.transactions.fileconsumption;

import java.io.File;

import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.lang.Validate;

public class FileConsumptionRouteBuilder extends RouteBuilder {
    private final String inputDirectory;
    private final String outputDirectory;
    private final String errorDirectory;

    public FileConsumptionRouteBuilder(String targetIn, String targetOut, String targetErrors) {
        Validate.notEmpty(targetIn, "targetIn is empty");
        Validate.notEmpty(targetOut, "targetOut is empty");
        Validate.notEmpty(targetOut, "targetErrors is empty");

        inputDirectory = new File(targetIn).getAbsolutePath();
        outputDirectory = new File(targetOut).getAbsolutePath();
        errorDirectory = new File(targetErrors).getAbsolutePath();
    }

    @Override
    public void configure() throws Exception {
        from("file:" + inputDirectory + "?moveFailed=" + errorDirectory)
            .log("Consumed file ${header[CamelFileName]}: ${body}")
            .convertBodyTo(String.class)
            .choice()
                .when(simple("${body} contains 'explode'"))
                    .to("mock:explosion")
                    .throwException(new IllegalArgumentException("File caused explosion"))
                .otherwise()
                    .to("file:" + outputDirectory)
            .endChoice();
    }
}
