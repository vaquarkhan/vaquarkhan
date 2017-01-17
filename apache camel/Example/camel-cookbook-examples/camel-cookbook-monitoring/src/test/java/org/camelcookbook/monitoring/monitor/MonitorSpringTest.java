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

package org.camelcookbook.monitoring.monitor;

import javax.management.MBeanServer;

import org.apache.camel.CamelContext;
import org.apache.camel.management.DefaultManagementNamingStrategy;
import org.apache.camel.spi.ManagementAgent;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MonitorSpringTest extends CamelSpringTestSupport {
    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/monitor-context.xml");
    }

    @Override
    protected CamelContext createCamelContext() throws Exception {
        enableJMX();

        CamelContext context = super.createCamelContext();

        DefaultManagementNamingStrategy naming = (DefaultManagementNamingStrategy) context.getManagementStrategy().getManagementNamingStrategy();
        naming.setHostName("localhost");
        naming.setDomainName("org.apache.camel");

        // setup the ManagementAgent to include the hostname
        context.getManagementStrategy().getManagementAgent().setIncludeHostName(true);

        return context;
    }

    @Test
    public void testMonitorSpring() throws Exception {
        final ManagementAgent managementAgent = context.getManagementStrategy().getManagementAgent();
        assertNotNull(managementAgent);

        final MBeanServer mBeanServer = managementAgent.getMBeanServer();
        assertNotNull(mBeanServer);

        final String mBeanServerDefaultDomain = managementAgent.getMBeanServerDefaultDomain();
        assertEquals("org.apache.camel", mBeanServerDefaultDomain);

        final String managementName = context.getManagementName();
        log.info("managementName = {}", managementName);

        getMockEndpoint("mock:result").expectedMessageCount(3);
        getMockEndpoint("mock:monitor").expectedMessageCount(4);

        // Send a couple of messages to get some route statistics
        template.sendBody("direct:start", "Hello Camel");
        Thread.sleep(1000);
        template.sendBody("direct:start", "Camel Rocks!");
        Thread.sleep(1000);
        template.sendBody("direct:start", "Camel Rocks!");
        Thread.sleep(1000);
    }
}
