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
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang.Validate;

/**
 * Utility builder used to locate a file given a number of options as to where it might be.
 * Usage: <code>new FileLocator().with(location1).with(location2).find()</code>
 * If #find() returns null, #getErrorMessage() will format a nice human-readable error message
 * with the locations that were looked up.
 */
public class FileLocator {
    private List<String> locations = new LinkedList<String>();
    private boolean used = false;
    private StringBuilder errorMessage = new StringBuilder();

    public FileLocator() {
    }

    public FileLocator with(String location) {
        Validate.isTrue(!used);
        locations.add(location);
        return this;
    }

    public File find() {
        used = true; // this builder can't be used again
        File foundFile = null;

        for (String location : locations) {
            File file = new File(location);
            String path;

            try {
                path = file.getCanonicalPath();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            if (file.exists()) {
                foundFile = file;
                break;
            } else {
                if (errorMessage.length() == 0) {
                    errorMessage.append("File not found in ");
                } else {
                    errorMessage.append(" or in ");
                }

                errorMessage.append("'").append(path).append("'");
            }
        }

        return foundFile;
    }

    public String getErrorMessage() {
        Validate.isTrue(used, "The find() method hasn't been called on this builder");
        return errorMessage.toString();
    }
}
