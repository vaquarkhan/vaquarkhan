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

package org.camelcookbook.parallelprocessing.asyncprocessor;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.camel.AsyncCallback;
import org.apache.camel.AsyncProcessor;
import org.apache.camel.Exchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SlowOperationProcessor implements AsyncProcessor {
    private final Logger log = LoggerFactory.getLogger(SlowOperationProcessor.class);
    private final ExecutorService backgroundExecutor = Executors.newSingleThreadExecutor();

    @Override
    public boolean process(final Exchange exchange, final AsyncCallback asyncCallback) {
        final boolean completedSynchronously = false;

        backgroundExecutor.submit(new Runnable() {
            @Override
            public void run() {
                log.info("Running operation asynchronously");
                try {
                    log.info("Doing something slowly");
                    Thread.sleep(200); // this runs slowly
                    log.info("...done");
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                // the current thread will continue to process the exchange
                // through the remainder of the route
                asyncCallback.done(completedSynchronously);
            }
        });

        return completedSynchronously;
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        throw new IllegalStateException("Should never be called");
    }
}
