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

package org.camelcookbook.security.encryptedproperties;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jasypt.JasyptPropertiesParser;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.component.properties.PropertiesComponent;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;

/**
 * Demonstrates the use of encrypted properties in Camel routes, where the master password is set in
 * a system property.
 */
public class EncryptedPropertiesPasswordInSystemPropertyTest extends CamelTestSupport {

    @Override
    public RouteBuilder createRouteBuilder() {
        return new EncryptedPropertiesRouteBuilder();
    }

    @Override
    public CamelContext createCamelContext() {
        // normally this would be set along the lines of -DjasyptMasterPassword=encryptionPassword
        // in a place appropriate to the runtime
        System.setProperty("jasyptMasterPassword", "encryptionPassword");

        JasyptPropertiesParser propParser = new JasyptPropertiesParser();
        propParser.setPassword("sys:jasyptMasterPassword");

        PropertiesComponent propComponent = new PropertiesComponent();
        propComponent.setLocation("classpath:placeholder.properties");
        propComponent.setPropertiesParser(propParser);

        CamelContext camelContext = new DefaultCamelContext();
        camelContext.addComponent("properties", propComponent);
        return camelContext;
    }

    @Test
    public void testPropertiesLoaded() throws InterruptedException {
        MockEndpoint mockOut = getMockEndpoint("mock:out");
        mockOut.setExpectedMessageCount(1);
        mockOut.message(0).header("dbPassword").isEqualTo("myDatabasePassword");

        template.sendBody("direct:in", "Foo");

        assertMockEndpointsSatisfied();
    }
}
