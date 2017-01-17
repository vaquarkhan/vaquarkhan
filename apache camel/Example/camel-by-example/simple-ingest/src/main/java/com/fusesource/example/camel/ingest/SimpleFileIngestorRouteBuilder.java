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

import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.dataformat.JaxbDataFormat;
import org.apache.camel.spi.IdempotentRepository;
import org.example.model.ObjectFactory;

import com.fusesource.example.camel.logic.NonRecoverableExternalServiceException;
import com.fusesource.example.camel.logic.RecoverableExternalServiceException;


public class SimpleFileIngestorRouteBuilder extends RouteBuilder {

	protected static final String ROUTE_ID_BASE = SimpleFileIngestorRouteBuilder.class
			.getPackage().getName() + ".fileIngestor";
	
	public static final String READ_FILE_ROUTE_ID = ROUTE_ID_BASE
			+ ".readFile";
	
	public static final String HANDLE_RECORD_ROUTE_ID = ROUTE_ID_BASE
            + ".handleRecord";

	public static final String HANDLE_RECORD_ROUTE_ENDPOINT_URI = "direct:"
            + HANDLE_RECORD_ROUTE_ID;
	
	public static final String TRANSFORM_RECORD_ROUTE_ID = ROUTE_ID_BASE
            + ".transformRecord";

	public static final String TRANSFORM_RECORD_ROUTE_ENDPOINT_URI = "direct:"
            + TRANSFORM_RECORD_ROUTE_ID;

	public static final String PROCESS_RECORD_ROUTE_ID = ROUTE_ID_BASE
            + ".processRecord";

	public static final String PROCESS_RECORD_ROUTE_ENDPOINT_URI = "direct:"
            + PROCESS_RECORD_ROUTE_ID;

	public static final String PERSIST_RECORD_ROUTE_ID = ROUTE_ID_BASE
            + ".persistRecord";

	public static final String PERSIST_RECORD_ROUTE_ENDPOINT_URI = "direct:"
            + PERSIST_RECORD_ROUTE_ID;
	
	public static final Map<String, String> NAMESPACES;
	
	static {
		Map<String, String> tempNamespaces = new HashMap<String, String>();
		tempNamespaces.put("example", "http://www.example.org/model");
		
		NAMESPACES = Collections.unmodifiableMap(tempNamespaces);
	}
	
	private String sourceDirPath;
	private String doneDirPath;
	private String failDirPath;
	private String alternatePersistEndpointUri;
	private IdempotentRepository<String> idempotentRepository;
	
	@Override
	public void configure() throws Exception {
	    JaxbDataFormat jbdf = new JaxbDataFormat();
        jbdf.setContextPath(ObjectFactory.class.getPackage().getName());
		
		from(getFileSourceUri())
			.routeId(READ_FILE_ROUTE_ID)
			.log(LoggingLevel.INFO, "Processing file: ${header.CamelFilePath}")
			.to("validator:org/example/model/model.xsd")
			.split()
			    .xpath("/example:aggregateRecord/example:record", NAMESPACES)
			    .executorService(getContext().getExecutorServiceManager().newThreadPool(
			            this, READ_FILE_ROUTE_ID, 10, 20))
				.to(HANDLE_RECORD_ROUTE_ENDPOINT_URI);
		
        from(HANDLE_RECORD_ROUTE_ENDPOINT_URI)
            .routeId(HANDLE_RECORD_ROUTE_ID)
            .unmarshal(jbdf)
            .log(LoggingLevel.INFO, "Handling record ${body.id}.")
            .to(TRANSFORM_RECORD_ROUTE_ENDPOINT_URI)
            .idempotentConsumer(simple("${in.body.id}"), idempotentRepository)
            .to(PROCESS_RECORD_ROUTE_ENDPOINT_URI)
            .to(PERSIST_RECORD_ROUTE_ENDPOINT_URI);
    
        from(TRANSFORM_RECORD_ROUTE_ENDPOINT_URI)
            .routeId(TRANSFORM_RECORD_ROUTE_ID)
            .to("bean:recordProcessor?method=transform");
    
        from(PROCESS_RECORD_ROUTE_ENDPOINT_URI)
            .routeId(PROCESS_RECORD_ROUTE_ID)
            .onException(RecoverableExternalServiceException.class)
                .maximumRedeliveries(1)
                .redeliveryDelay(1000l)
                .logRetryAttempted(true)
                .logRetryStackTrace(true)
                .retryAttemptedLogLevel(LoggingLevel.WARN)
            .end()
            .onException(NonRecoverableExternalServiceException.class)
                .log(LoggingLevel.ERROR,
                        "Terminal error processing ${in.body}.  Failing-fast."
                                + " ${exception.stacktrace}")
            .end()
            .to("bean:recordProcessor?method=processRecord");
    
        from(PERSIST_RECORD_ROUTE_ENDPOINT_URI)
            .routeId(PERSIST_RECORD_ROUTE_ID)
            .onException(SQLException.class)
                .maximumRedeliveries(1)
                .redeliveryDelay(1000l)
                .logRetryAttempted(true)
                .logRetryStackTrace(true)
                .retryAttemptedLogLevel(LoggingLevel.WARN)
            .end()
            .transacted("JDBC_PROPAGATION_REQUIRES_NEW")
            .to(getPersistEndpointUri());
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
	
	public String getAlternatePersistEndpointUri() {
        return alternatePersistEndpointUri;
    }

    public void setAlternatePersistEndpointUri(
            String alternatePersistEndpointUri) {
        this.alternatePersistEndpointUri = alternatePersistEndpointUri;
    }
    
    public IdempotentRepository<String> getIdempotentRepository() {
        return idempotentRepository;
    }

    public void setIdempotentRepository(
            IdempotentRepository<String> idempotentRepository) {
        this.idempotentRepository = idempotentRepository;
    }

    protected String getFileSourceUri() {
		return "file://" + sourceDirPath + "?moveFailed=" + failDirPath + "&move=" + doneDirPath;
	}
	
	protected String getPersistEndpointUri() {
        if (alternatePersistEndpointUri != null) {
            return alternatePersistEndpointUri;
        } else {
            return "ibatis:com.fusesource.example.camel.process.insertRecord?statementType=Insert";
        }
    }
}
