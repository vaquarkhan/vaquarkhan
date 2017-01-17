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

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.CamelAuthorizationException;
import org.apache.camel.CamelExecutionException;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.security.authentication.BadCredentialsException;

/**
 * Demonstrates the Spring Security to apply authentication and authorization to a route.
 */
public class SpringSecuritySpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/springSecurity-context.xml");
    }

    @Test
    public void testSecuredServiceAccess() throws InterruptedException {
        MockEndpoint mockSecure = getMockEndpoint("mock:secure");
        mockSecure.setExpectedMessageCount(1);
        mockSecure.expectedBodiesReceived("foo");

        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("username", "jakub");
        headers.put("password", "supersecretpassword1");
        template.sendBodyAndHeaders("direct:in", "foo", headers);

        assertMockEndpointsSatisfied();
    }

    @Test
    public void testBadPassword() {
        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("username", "jakub");
        headers.put("password", "iforgotmypassword");
        try {
            template.sendBodyAndHeaders("direct:in", "foo", headers);
            fail();
        } catch (CamelExecutionException ex) {
            CamelAuthorizationException cax = (CamelAuthorizationException) ex.getCause();
            assertTrue(ExceptionUtils.getRootCause(cax) instanceof BadCredentialsException);
        }
    }

    @Test
    public void testNotAuthorized() {
        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("username", "scott");
        headers.put("password", "supersecretpassword2");
        try {
            template.sendBodyAndHeaders("direct:in", "foo", headers);
            fail();
        } catch (CamelExecutionException ex) {
            assertTrue(ExceptionUtils.getCause(ex) instanceof CamelAuthorizationException);
        }
    }
}
