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

package org.camelcookbook.transactions.utils;

import java.io.File;
import javax.sql.DataSource;

import org.apache.commons.lang.Validate;
import org.camelcookbook.transactions.util.DataSourceInitializer;
import org.h2.jdbcx.JdbcDataSource;
import org.springframework.core.io.FileSystemResource;

/**
 * Utility class that centralises the wiring of a DataSource to the embedded database.
 */
public class EmbeddedDataSourceFactory {

    public static DataSource getDataSource(String initScriptLocation) {
        return getJdbcDataSource(initScriptLocation);
    }

    public static JdbcDataSource getJdbcDataSource(String initScriptLocation) {
        Validate.notEmpty(initScriptLocation, "initScriptLocation is empty");

        String mavenRelativePath = "src/main/resources/" + initScriptLocation;
        String mavenRootRelativePath = "camel-cookbook-transactions/" + mavenRelativePath;

        // check that we can load the init script
        FileLocator locator = new FileLocator().with(initScriptLocation).with(mavenRelativePath).with(mavenRootRelativePath);
        File file = locator.find();
        Validate.notNull(file, locator.getErrorMessage());
        FileSystemResource script = new FileSystemResource(file);

        JdbcDataSource dataSource = new JdbcDataSource();
        dataSource.setURL("jdbc:h2:mem:db1;DB_CLOSE_DELAY=-1");
        dataSource.setUser("sa");
        dataSource.setPassword("");

        DataSourceInitializer.initializeDataSource(dataSource, script);

        return dataSource;
    }

    private EmbeddedDataSourceFactory() {
    }
}
