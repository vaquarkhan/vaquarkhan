/**
  * Copyright 2012 FuseSource
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
package com.fusesource.example.camel.ingest;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;

public class FileIngestorRouteBuilder extends RouteBuilder {

	protected static final String ROUTE_ID_BASE = FileIngestorRouteBuilder.class
			.getPackage().getName() + ".fileIngestor";
	
	protected static final String READ_FILE_ROUTE_ID = ROUTE_ID_BASE
			+ ".readFile";
	
	protected static final String ENQUEUE_RECORD_ROUTE_ID = ROUTE_ID_BASE
			+ ".enqueueRecord";
	
	protected static final String ENQUEUE_RECORD_ROUTE_ENDPOINT_URI =
			"direct:" + ENQUEUE_RECORD_ROUTE_ID;
	
	protected static final Map<String, String> NAMESPACES;
	
	static {
		Map<String, String> tempNamespaces = new HashMap<String, String>();
		tempNamespaces.put("example", "http://www.example.org/model");
		
		NAMESPACES = Collections.unmodifiableMap(tempNamespaces);
	}
	
	private String sourceDirPath;
	private String doneDirPath;
	private String failDirPath;
	private String recordsQueueName;
	
	@Override
	public void configure() throws Exception {
		
		from(getFileSourceUri())
			.routeId(READ_FILE_ROUTE_ID)
			.log(LoggingLevel.INFO, "Processing file: ${header.CamelFilePath}")
			.to("validator:org/example/model/model.xsd")
			.split()
				.xpath("/example:aggregateRecord/example:record", NAMESPACES)
				.to(ENQUEUE_RECORD_ROUTE_ENDPOINT_URI);
		
		from(ENQUEUE_RECORD_ROUTE_ENDPOINT_URI)
			.routeId(ENQUEUE_RECORD_ROUTE_ID)
			.onException(Exception.class)
				.redeliveryDelay(1000l)
				.maximumRedeliveries(2)
				.useExponentialBackOff()
			.end()
			.log(LoggingLevel.INFO, "Enqueuing record ${property.CamelSplitIndex} "
					+ "of ${property.CamelSplitSize}")
			.to(getEnqueueRecordsDestinationUri());
	}

	public String getSourceDirPath() {
		return sourceDirPath;
	}

	public void setSourceDirPath(String sourceDirPath) {
		this.sourceDirPath = sourceDirPath;
	}

	public String getDoneDirPath() {
		return doneDirPath;
	}

	public void setDoneDirPath(String doneDirPath) {
		this.doneDirPath = doneDirPath;
	}

	public String getFailDirPath() {
		return failDirPath;
	}

	public void setFailDirPath(String failDirPath) {
		this.failDirPath = failDirPath;
	}

	public String getRecordsQueueName() {
		return recordsQueueName;
	}

	public void setRecordsQueueName(String recordsQueueName) {
		this.recordsQueueName = recordsQueueName;
	}
	
	protected String getEnqueueRecordsDestinationUri() {
		return "activemq:queue:" + recordsQueueName; 
	}
	
	protected String getFileSourceUri() {
		return "file://" + sourceDirPath + "?moveFailed=" + failDirPath + "&move=" + doneDirPath;
	}
}
