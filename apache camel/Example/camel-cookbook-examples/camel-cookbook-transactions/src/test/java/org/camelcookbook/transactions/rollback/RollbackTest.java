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

import javax.sql.DataSource;

import org.apache.camel.CamelContext;
import org.apache.camel.CamelExecutionException;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.component.sql.SqlComponent;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.spring.spi.SpringTransactionPolicy;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.utils.EmbeddedDataSourceFactory;
import org.junit.Test;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

/**
 * Demonstrates the behavior of rolling back transactions manually.
 */
public class RollbackTest extends CamelTestSupport {

    private AuditLogDao auditLogDao;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new RollbackRouteBuilder();
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        SimpleRegistry registry = new SimpleRegistry();
        DataSource auditDataSource = EmbeddedDataSourceFactory.getDataSource("sql/schema.sql");

        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(auditDataSource);
        registry.put("transactionManager", transactionManager);

        SpringTransactionPolicy propagationRequired = new SpringTransactionPolicy();
        propagationRequired.setTransactionManager(transactionManager);
        propagationRequired.setPropagationBehaviorName("PROPAGATION_REQUIRED");
        registry.put("PROPAGATION_REQUIRED", propagationRequired);

        auditLogDao = new AuditLogDao(auditDataSource);

        CamelContext camelContext = new DefaultCamelContext(registry);

        SqlComponent sqlComponent = new SqlComponent();
        sqlComponent.setDataSource(auditDataSource);
        camelContext.addComponent("sql", sqlComponent);

        return camelContext;
    }

    @Test
    public void testTransactedRollback() throws InterruptedException {
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
