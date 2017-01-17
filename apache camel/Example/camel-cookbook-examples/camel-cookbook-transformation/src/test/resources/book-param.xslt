<?xml version="1.0" encoding="UTF-8"?>
<!--
  ~ Copyright (C) Scott Cranton and Jakub Korab
  ~ https://github.com/CamelCookbook
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output omit-xml-declaration="yes"/>

  <xsl:param name="myParamValue"/>

  <xsl:template match="/">
    <books>
      <xsl:attribute name="value">
        <xsl:value-of select="$myParamValue"/>
      </xsl:attribute>
      <xsl:apply-templates select="/bookstore/book/title[../price>$myParamValue]">
        <xsl:sort select="."/>
      </xsl:apply-templates>
    </books>
  </xsl:template>

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>