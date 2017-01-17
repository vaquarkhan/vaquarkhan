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

package org.camelcookbook.transactions.rollback;

import org.apache.camel.CamelExecutionException;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the behavior of rolling back transactions manually.
 */
public class RollbackSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/rollback-context.xml");
    }

    @Test
    public void testTransactedRollback() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        String message = "this message will explode";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockCompleted = getMockEndpoint("mock:out");
        mockCompleted.setExpectedMessageCount(0);

        try {
            template.sendBody("direct:transacted", message);
            fail();
        } catch (CamelExecutionException cee) {
            Throwable rootCause = ExceptionUtils.getRootCause(cee);
            assertTrue(rootCause instanceof org.apache.camel.RollbackExchangeException);
            assertTrue(rootCause.getMessage().startsWith("Message contained word 'explode'"));
        }

        assertMockEndpointsSatisfied();
        assertEquals(0, auditLogDao.getAuditCount(message)); // the insert was rolled back
    }
}
