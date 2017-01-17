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

package org.camelcookbook.transactions.xatransaction;

import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Demonstrates the use of an XA transaction manager with a JMS component and database.
 */
public class XATransactionSpringTest extends CamelSpringTestSupport {

    public static final int MAX_WAIT_TIME = 1000;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/xaTransaction-context.xml");
    }

    @Test
    public void testTransactedRolledBack() throws InterruptedException {
        AuditLogDao auditLogDao = getMandatoryBean(AuditLogDao.class, "auditLogDao");

        String message = "this message will explode";
        assertEquals(0, auditLogDao.getAuditCount(message));

        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.whenAnyExchangeReceived(new ExceptionThrowingProcessor());

        // even though the route throws an exception, we don't have to deal with it here as we
        // don't send the message to the route directly, but to the broker, which acts as a middleman.
        template.sendBody("nonTxJms:inbound", message);

        // the consumption of the message is transacted, so a message should end up in the DLQ
        assertEquals(message, consumer.receiveBody("jms:ActiveMQ.DLQ", MAX_WAIT_TIME, String.class));

        // the send operation is performed while a database transaction is going on, so it is rolled back
        // on exception
        assertNull(consumer.receiveBody("jms:outbound", MAX_WAIT_TIME, String.class));

        assertEquals(0, auditLogDao.getAuditCount(message)); // the insert is rolled back
    }
}
