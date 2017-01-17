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

package org.camelcookbook.routing.changingmep;

import org.apache.camel.EndpointInject;
import org.apache.camel.Exchange;
import org.apache.camel.ExchangePattern;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class CallingInOnlySpringTest extends CamelSpringTestSupport {
    @EndpointInject(uri = "mock:beforeOneWay")
    private MockEndpoint beforeOneWay;

    @EndpointInject(uri = "mock:oneWay")
    private MockEndpoint oneWay;

    @EndpointInject(uri = "mock:afterOneWay")
    private MockEndpoint afterOneWay;

    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("META-INF/spring/changingMep-callingInOnly-context.xml");
    }

    @Test
    public void testInOnlyMEPChangedForOneWay() throws InterruptedException {
        final String messageBody = "Camel Rocks";
        final ExchangePattern callingMEP = ExchangePattern.InOnly;

        beforeOneWay.setExpectedMessageCount(1);
        // Should be calling Exchange Pattern
        beforeOneWay.message(0).exchangePattern().isEqualTo(callingMEP);

        oneWay.setExpectedMessageCount(1);
        // Should always be InOnly
        oneWay.message(0).exchangePattern().isEqualTo(ExchangePattern.InOnly);

        afterOneWay.setExpectedMessageCount(1);
        // Should be restored to calling Exchange Pattern
        afterOneWay.message(0).exchangePattern().isEqualTo(callingMEP);

        // Explicitly set Exchange Pattern
        template.sendBody("direct:start", callingMEP, messageBody);

        assertMockEndpointsSatisfied();

        Exchange oneWayExchange = oneWay.getReceivedExchanges().get(0);
        Exchange afterOneWayExchange = afterOneWay.getReceivedExchanges().get(0);

        // these are not the same exchange objects
        assertNotEquals(oneWayExchange, afterOneWayExchange);

        // the bodies should be the same - shallow copy
        assertEquals(oneWayExchange.getIn().getBody(), afterOneWayExchange.getIn().getBody());

        // the transactions are the same
        assertEquals(oneWayExchange.getUnitOfWork(), afterOneWayExchange.getUnitOfWork());
    }

    @Test
    public void testInOutMEPChangedForOneWay() throws InterruptedException {
        final String messageBody = "Camel Rocks";
        final ExchangePattern callingMEP = ExchangePattern.InOut;

        beforeOneWay.setExpectedMessageCount(1);
        // Should be calling Exchange Pattern
        beforeOneWay.message(0).exchangePattern().isEqualTo(callingMEP);

        oneWay.setExpectedMessageCount(1);
        // Should always be InOnly
        oneWay.message(0).exchangePattern().isEqualTo(ExchangePattern.InOnly);

        afterOneWay.setExpectedMessageCount(1);
        // Should be restored to calling Exchange Pattern
        afterOneWay.message(0).exchangePattern().isEqualTo(callingMEP);

        // Explicitly set Exchange Pattern
        template.sendBody("direct:start", callingMEP, messageBody);

        assertMockEndpointsSatisfied();

        Exchange oneWayExchange = oneWay.getReceivedExchanges().get(0);
        Exchange afterOneWayExchange = afterOneWay.getReceivedExchanges().get(0);

        // these are not the same exchange objects
        assertNotEquals(oneWayExchange, afterOneWayExchange);

        // the bodies should be the same - shallow copy
        assertEquals(oneWayExchange.getIn().getBody(), afterOneWayExchange.getIn().getBody());

        // the transactions are the same
        assertEquals(oneWayExchange.getUnitOfWork(), afterOneWayExchange.getUnitOfWork());
    }
}
