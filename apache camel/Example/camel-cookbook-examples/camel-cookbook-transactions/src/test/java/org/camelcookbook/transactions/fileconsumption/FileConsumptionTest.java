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

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Demonstrates the use of a Synchronization to change state depending on whether an Exchange completed or failed.
 */
public class FileConsumptionTest extends CamelTestSupport {
    private static Logger log = LoggerFactory.getLogger(FileConsumptionTest.class);

    public static final String TARGET_TEMP = "target/temp/";
    public static final String TARGET_IN = "target/in/";
    public static final String TARGET_OUT = "target/out/";
    public static final String TARGET_ERRORS = "target/errors/";

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        createTargetDirectories();
        return new FileConsumptionRouteBuilder(TARGET_IN, TARGET_OUT, TARGET_ERRORS);
    }

    @Test
    public void testFileLocationOnError() throws IOException, InterruptedException {
        String text = "This message will explode";

        MockEndpoint mockExplosion = getMockEndpoint("mock:explosion");
        mockExplosion.expectedMessageCount(1);
        mockExplosion.message(0).body().isEqualTo(text);

        String fileName = "expectedToFail.txt";
        safelyWriteFile(fileName, text);
        Thread.sleep(2000); // give the route a bit of time to work

        assertMockEndpointsSatisfied();

        // check that the message never got to the output directory, and is in the errors directory
        assertTrue(!new File(TARGET_OUT + fileName).exists());
        assertTrue(new File(TARGET_ERRORS + fileName).exists());
    }

    @Test
    public void testFileLocationOnSuccess() throws IOException, InterruptedException {
        String fileName = "expectedToPass.txt";
        String text = "This message should be written out with no problems";

        MockEndpoint mockExplosion = getMockEndpoint("mock:explosion");
        mockExplosion.expectedMessageCount(0);

        safelyWriteFile(fileName, text);
        Thread.sleep(2000); // give the route a bit of time to work

        assertMockEndpointsSatisfied();

        // check that the message got to the output directory, and is not in the errors directory
        assertTrue(new File(TARGET_OUT + fileName).exists());
        assertTrue(!new File(TARGET_ERRORS + fileName).exists());
    }

    private void createTargetDirectories() {
        createIfNotExists(TARGET_TEMP);
        createIfNotExists(TARGET_IN);
        createIfNotExists(TARGET_OUT);
        createIfNotExists(TARGET_ERRORS);
    }

    private void createIfNotExists(String location) {
        File file = new File(location);
        if (file.exists()) {
            // delete it to make sure that any files from a previous run have been destroyed
            log.info("Deleting {}", file.getAbsolutePath());
            delete(file);
        }

        if (!file.mkdirs()) {
            throw new IllegalStateException("Could not create " + file.getAbsolutePath() + ". Check your directory permissions.");
        }
    }

    private void delete(File file) {
        if (file.isDirectory()) {
            for (File child : file.listFiles()) {
                delete(child);
            }
        }

        if (!file.delete()) {
            throw new IllegalStateException("Failed to delete file: " + file);
        }
    }

    private void safelyWriteFile(String fileName, String text) throws IOException {
        File outputFile = new File(TARGET_TEMP + fileName);
        log.info("Writing temporary file: {}", outputFile.getAbsolutePath());

        BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));
        writer.append(text);
        writer.close();

        // move the file - the Camel file consumer doesn't like files being written at the same time
        File destination = new File(TARGET_IN + fileName);
        log.info("Moving temporary file to: {}", destination.getAbsolutePath());
        outputFile.renameTo(destination);
    }
}
