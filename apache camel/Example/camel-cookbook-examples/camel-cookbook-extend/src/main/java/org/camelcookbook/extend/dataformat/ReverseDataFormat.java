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

package org.camelcookbook.extend.dataformat;

import java.io.InputStream;
import java.io.OutputStream;

import org.apache.camel.Exchange;
import org.apache.camel.spi.DataFormat;
import org.apache.camel.util.ExchangeHelper;

public class ReverseDataFormat implements DataFormat {
    @Override
    public void marshal(Exchange exchange, Object graph, OutputStream stream) throws Exception {
        byte[] bytes = ExchangeHelper.convertToType(exchange, byte[].class, graph);

        stream.write(reverse(bytes));
    }

    @Override
    public Object unmarshal(Exchange exchange, InputStream stream) throws Exception {
        byte[] bytes = ExchangeHelper.convertToType(exchange, byte[].class, stream);

        return reverse(bytes);
    }

    private byte[] reverse(byte[] bytes) {
        byte[] result = new byte[bytes.length];

        final int lim = bytes.length - 1;
        for (int i = 0; i <= lim; i++) {
            result[i] = bytes[lim - i];
        }

        return result;
    }
}
