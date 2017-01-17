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

package org.camelcookbook.transactions.databasetransaction;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the behavior of database transactions.
 */
public class DatabaseTransactionSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/databaseTransaction-context.xml");
    }

    @Test
    public void testNonTransactedSuccess() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        String message = "sample message";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockCompleted = getMockEndpoint("mock:out");
        mockCompleted.setExpectedMessageCount(1);

        template.sendBody("direct:nonTransacted", message);

        assertMockEndpointsSatisfied();
        assertEquals(1, auditLogDao.getAuditCount(message));
    }

    @Test
    public void testNonTransactedExceptionThrown() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        String message = "this message will explode";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockCompleted = getMockEndpoint("mock:out");
        mockCompleted.setExpectedMessageCount(1);
        mockCompleted.whenAnyExchangeReceived(new ExceptionThrowingProcessor());

        try {
            template.sendBody("direct:nonTransacted", message);
            fail();
        } catch (CamelExecutionException cee) {
            assertEquals("boom!", ExceptionUtils.getRootCause(cee).getMessage());
        }

        assertMockEndpointsSatisfied();
        assertEquals(1, auditLogDao.getAuditCount(message)); // the insert was not rolled back
    }

    @Test
    public void testTransactedExceptionThrown() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        String message = "this message will explode";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockCompleted = getMockEndpoint("mock:out");
        mockCompleted.setExpectedMessageCount(1);
        mockCompleted.whenAnyExchangeReceived(new ExceptionThrowingProcessor());

        try {
            template.sendBody("direct:transacted", message);
            fail();
        } catch (CamelExecutionException cee) {
            assertEquals("boom!", ExceptionUtils.getRootCause(cee).getMessage());
        }

        assertMockEndpointsSatisfied();
        assertEquals(0, auditLogDao.getAuditCount(message)); // the insert was rolled back
    }
}
