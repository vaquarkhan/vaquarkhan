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

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.dao.MessageDao;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the behavior of marking the last transaction for rollback.
 */
public class RollbackMarkRollbackOnlyLastSpringTest extends CamelSpringTestSupport {

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/rollbackMarkRollbackOnlyLast-context.xml");
    }

    @Test
    public void testFailure() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");
        MessageDao messageDao = getMandatoryBean(MessageDao.class, "messageDao");

        String message = "this message will explode";
        assertEquals(0, auditLogDao.getAuditCount(message));

        // the outer route will continue to run as though nothing happened
        MockEndpoint mockOut1 = getMockEndpoint("mock:out1");
        mockOut1.setExpectedMessageCount(1);
        mockOut1.message(0).body().isEqualTo(message);

        // processing will not have reached the mock endpoint in the sub-route
        MockEndpoint mockOut2 = getMockEndpoint("mock:out2");
        mockOut2.setExpectedMessageCount(0);

        template.sendBody("direct:route1", message);

        assertMockEndpointsSatisfied();
        assertEquals(0, auditLogDao.getAuditCount(message));
        assertEquals(1, messageDao.getMessageCount(message));
    }
}
