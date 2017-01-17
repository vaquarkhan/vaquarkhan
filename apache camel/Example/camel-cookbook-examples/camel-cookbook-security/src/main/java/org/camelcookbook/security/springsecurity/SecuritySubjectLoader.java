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

package org.camelcookbook.security.springsecurity;

import javax.security.auth.Subject;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

/**
 * Processor that fetches the user credentials from the Exchange and sets up the
 * {@link org.springframework.security.core.Authentication} object on the Exchange.
 */
public class SecuritySubjectLoader implements Processor {
    @Override
    public void process(Exchange exchange) throws Exception {
        Message in = exchange.getIn();
        String username = in.getHeader("username", String.class);
        String password = in.getHeader("password", String.class);

        Authentication authenticationToken =
            new UsernamePasswordAuthenticationToken(username, password);
        Subject subject = new Subject();
        subject.getPrincipals().add(authenticationToken);
        in.setHeader(Exchange.AUTHENTICATION, subject);
    }
}

