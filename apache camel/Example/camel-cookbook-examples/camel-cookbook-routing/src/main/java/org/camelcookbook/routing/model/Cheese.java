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

package org.camelcookbook.routing.model;

/**
 * Simple POJO that allows for leaky state between threads.
 */
public class Cheese implements Cloneable {
    private int age;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public Cheese clone() {
        Cheese cheese = new Cheese();
        cheese.setAge(this.getAge());
        return cheese;
    }

    @Override
    public int hashCode() {
        return age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Cheese cheese = (Cheese) o;

        return age == cheese.age;
    }

    @Override
    public String toString() {
        return "Cheese{" +
            "age=" + age +
            '}';
    }
}
