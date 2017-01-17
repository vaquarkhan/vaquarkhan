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

package org.camelcookbook.transactions.idempotentconsumerintransaction;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.spi.IdempotentRepository;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the use of onCompletion blocks.
 */
public class IdempotentConsumerInTransactionSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/idempotentConsumerInTransaction-context.xml");
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
            template.sendBodyAndHeader("direct:transacted", message, "messageId", "foo");
            fail();
        } catch (CamelExecutionException cee) {
            assertEquals("boom!", ExceptionUtils.getRootCause(cee).getMessage());
        }

        assertMockEndpointsSatisfied();
        assertEquals(0, auditLogDao.getAuditCount(message)); // the insert was rolled back

        @SuppressWarnings("unchecked")
        IdempotentRepository<String> idempotentRepository = getMandatoryBean(IdempotentRepository.class, "jdbcIdempotentRepository");

        // even though the transaction rolled back, the repository should still contain an entry for this messageId
        assertTrue(idempotentRepository.contains("foo"));
    }

    @Test
    public void testTransactedExceptionNotThrown() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        String message = "this message will be OK";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockCompleted = getMockEndpoint("mock:out");
        mockCompleted.setExpectedMessageCount(1);

        template.sendBodyAndHeader("direct:transacted", message, "messageId", "foo");

        assertMockEndpointsSatisfied();
        assertEquals(1, auditLogDao.getAuditCount(message)); // the insert was successful

        @SuppressWarnings("unchecked")
        IdempotentRepository<String> idempotentRepository = getMandatoryBean(IdempotentRepository.class, "jdbcIdempotentRepository");

        // even though the transaction rolled back, the repository should still contain an entry for this messageId
        assertTrue(idempotentRepository.contains("foo"));
    }

    @Test
    public void testWebserviceExceptionRollsBackTransactionAndIdempotentRepository() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        String message = "this message will be OK";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockCompleted = getMockEndpoint("mock:out");
        mockCompleted.setExpectedMessageCount(0);

        MockEndpoint mockWs = getMockEndpoint("mock:ws");
        mockWs.whenAnyExchangeReceived(new ExceptionThrowingProcessor("ws is down"));

        try {
            template.sendBodyAndHeader("direct:transacted", message, "messageId", "foo");
            fail();
        } catch (CamelExecutionException cee) {
            assertEquals("ws is down", ExceptionUtils.getRootCause(cee).getMessage());
        }

        assertMockEndpointsSatisfied();
        assertEquals(0, auditLogDao.getAuditCount(message)); // the insert was successful

        @SuppressWarnings("unchecked")
        IdempotentRepository<String> idempotentRepository = getMandatoryBean(IdempotentRepository.class, "jdbcIdempotentRepository");

        // the repository has not seen this messageId
        assertTrue(!idempotentRepository.contains("foo"));
    }
}
