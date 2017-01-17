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
import org.apache.camel.Message;

public class HeaderDrivenSlowOperationProcessor implements AsyncProcessor {
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    @Override
    public boolean process(final Exchange exchange,
                           final AsyncCallback asyncCallback) {
        final Message in = exchange.getIn();
        if (in.getHeader("processAsync", Boolean.class)) {
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    in.setBody("Processed async: " + in.getBody(String.class));
                    asyncCallback.done(false);
                }
            });
            return false;
        } else {
            in.setBody("Processed sync: " + in.getBody(String.class));
            asyncCallback.done(true);
            return true;
        }
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        throw new IllegalStateException("Should never be called");
    }
}
