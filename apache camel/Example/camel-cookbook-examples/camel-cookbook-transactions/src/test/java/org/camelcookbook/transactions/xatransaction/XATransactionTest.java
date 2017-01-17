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

import com.atomikos.icatch.jta.UserTransactionImp;
import com.atomikos.icatch.jta.UserTransactionManager;
import com.atomikos.jdbc.AtomikosDataSourceBean;
import com.atomikos.jms.AtomikosConnectionFactoryBean;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQXAConnectionFactory;
import org.apache.activemq.camel.component.ActiveMQComponent;
import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.component.sql.SqlComponent;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.SimpleRegistry;
import org.apache.camel.spring.spi.SpringTransactionPolicy;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.camelcookbook.transactions.dao.AuditLogDao;
import org.camelcookbook.transactions.utils.EmbeddedActiveMQBroker;
import org.camelcookbook.transactions.utils.EmbeddedDataSourceFactory;
import org.camelcookbook.transactions.utils.ExceptionThrowingProcessor;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.transaction.jta.JtaTransactionManager;

/**
 * Demonstrates the use of an XA transaction manager with a JMS component and database.
 */
public class XATransactionTest extends CamelTestSupport {

    public static final int MAX_WAIT_TIME = 1000;

    private AuditLogDao auditLogDao;

    @Rule
    public EmbeddedActiveMQBroker broker = new EmbeddedActiveMQBroker("embeddedBroker");
    private AtomikosConnectionFactoryBean atomikosConnectionFactoryBean;
    private UserTransactionManager userTransactionManager;

    @Override
    protected RouteBuilder createRouteBuilder() throws Exception {
        return new XATransactionRouteBuilder();
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        SimpleRegistry registry = new SimpleRegistry();

        // JMS setup
        ActiveMQXAConnectionFactory xaConnectionFactory =
            new ActiveMQXAConnectionFactory();
        xaConnectionFactory.setBrokerURL(broker.getTcpConnectorUri());
        registry.put("connectionFactory", xaConnectionFactory);

        atomikosConnectionFactoryBean = new AtomikosConnectionFactoryBean();
        atomikosConnectionFactoryBean.setXaConnectionFactory(xaConnectionFactory);
        atomikosConnectionFactoryBean.setUniqueResourceName("xa.activemq");
        atomikosConnectionFactoryBean.setMaxPoolSize(10);
        atomikosConnectionFactoryBean.setIgnoreSessionTransactedFlag(false);
        registry.put("atomikos.connectionFactory", atomikosConnectionFactoryBean);


        // JDBC setup
        JdbcDataSource jdbcDataSource = EmbeddedDataSourceFactory.getJdbcDataSource("sql/schema.sql");

        AtomikosDataSourceBean atomikosDataSourceBean = new AtomikosDataSourceBean();
        atomikosDataSourceBean.setXaDataSource(jdbcDataSource);
        atomikosDataSourceBean.setUniqueResourceName("xa.h2");
        registry.put("atomikos.dataSource", atomikosDataSourceBean);


        // Atomikos setup
        userTransactionManager = new UserTransactionManager();
        userTransactionManager.setForceShutdown(false);
        userTransactionManager.init();

        UserTransactionImp userTransactionImp = new UserTransactionImp();
        userTransactionImp.setTransactionTimeout(300);

        JtaTransactionManager jtaTransactionManager = new JtaTransactionManager();
        jtaTransactionManager.setTransactionManager(userTransactionManager);
        jtaTransactionManager.setUserTransaction(userTransactionImp);

        registry.put("jta.transactionManager", jtaTransactionManager);

        SpringTransactionPolicy propagationRequired = new SpringTransactionPolicy();
        propagationRequired.setTransactionManager(jtaTransactionManager);
        propagationRequired.setPropagationBehaviorName("PROPAGATION_REQUIRED");
        registry.put("PROPAGATION_REQUIRED", propagationRequired);


        auditLogDao = new AuditLogDao(jdbcDataSource);

        CamelContext camelContext = new DefaultCamelContext(registry);

        {
            SqlComponent sqlComponent = new SqlComponent();
            sqlComponent.setDataSource(atomikosDataSourceBean);
            camelContext.addComponent("sql", sqlComponent);
        }
        {
            // transactional JMS component
            ActiveMQComponent activeMQComponent = new ActiveMQComponent();
            activeMQComponent.setConnectionFactory(atomikosConnectionFactoryBean);
            activeMQComponent.setTransactionManager(jtaTransactionManager);
            camelContext.addComponent("jms", activeMQComponent);
        }
        {
            // non-transactional JMS component setup for test purposes
            ActiveMQConnectionFactory connectionFactory =
                new ActiveMQConnectionFactory();
            connectionFactory.setBrokerURL(broker.getTcpConnectorUri());

            ActiveMQComponent activeMQComponent = new ActiveMQComponent();
            activeMQComponent.setConnectionFactory(connectionFactory);
            activeMQComponent.setTransactionManager(jtaTransactionManager);
            camelContext.addComponent("nonTxJms", activeMQComponent);
        }
        return camelContext;
    }

    @After
    public void closeAtomikosResources() {
        userTransactionManager.close();
        atomikosConnectionFactoryBean.close();
    }


    @Test
    public void testTransactedRolledBack() throws InterruptedException {
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
