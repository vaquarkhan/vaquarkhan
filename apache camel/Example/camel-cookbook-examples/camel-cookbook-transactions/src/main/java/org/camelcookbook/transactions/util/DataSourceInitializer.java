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

package org.camelcookbook.transactions.util;

import javax.sql.DataSource;

import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

/**
 * Utility class for initializing a DataSource with a SQL script.
 */
public class DataSourceInitializer {
    public static DataSource initializeDataSource(DataSource dataSource, Resource script) {
        // here we use the same classes that Spring does under the covers to run the schema into the database
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.addScript(script);
        DatabasePopulatorUtils.execute(populator, dataSource);

        return dataSource;
    }
}
