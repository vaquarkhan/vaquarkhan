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
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.component.sql.SqlComponent;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.spring.spi.SpringTransactionPolicy;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.dao.MessageDao;
import org.camelcookbook.transactions.utils.EmbeddedDataSourceFactory;
import org.junit.Test;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

/**
 * Demonstrates the behavior of marking the last transaction for rollback.
 */
public class RollbackMarkRollbackOnlyLastTest extends CamelTestSupport {

    private AuditLogDao auditLogDao;
    private MessageDao messageDao;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new RollbackMarkRollbackOnlyLastRouteBuilder();
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        SimpleRegistry registry = new SimpleRegistry();
        DataSource dataSource = EmbeddedDataSourceFactory.getDataSource("sql/schema.sql");

        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);
        registry.put("transactionManager", transactionManager);

        {
            SpringTransactionPolicy propagationRequiresNew = new SpringTransactionPolicy();
            propagationRequiresNew.setTransactionManager(transactionManager);
            propagationRequiresNew.setPropagationBehaviorName("PROPAGATION_REQUIRES_NEW");
            registry.put("PROPAGATION_REQUIRES_NEW", propagationRequiresNew);
        }

        {
            SpringTransactionPolicy propagationRequiresNew2 = new SpringTransactionPolicy();
            propagationRequiresNew2.setTransactionManager(transactionManager);
            propagationRequiresNew2.setPropagationBehaviorName("PROPAGATION_REQUIRES_NEW");
            registry.put("PROPAGATION_REQUIRES_NEW-2", propagationRequiresNew2);
        }

        auditLogDao = new AuditLogDao(dataSource);
        messageDao = new MessageDao(dataSource);

        CamelContext camelContext = new DefaultCamelContext(registry);

        SqlComponent sqlComponent = new SqlComponent();
        sqlComponent.setDataSource(dataSource);
        camelContext.addComponent("sql", sqlComponent);

        return camelContext;
    }

    @Test
    public void testFailure() throws InterruptedException {
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
