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
package com.fusesource.example.camel.logic;

import org.example.model.RecordType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fusesource.example.camel.model.Record;


public class DefaultRecordProcessor implements RecordProcessor {

	private static final Logger LOG = LoggerFactory.getLogger(DefaultRecordProcessor.class);
	
	@Override
	public void processRecord(Record record) throws ExternalServiceException {
		LOG.debug("Processing record: {}", record.getId());
		
		try {
			Thread.sleep(1000l);
		} catch (InterruptedException e) {
			throw new ExternalServiceException(e);
		}
		LOG.info("Processed record: {}", record.getId());
	}

	@Override
	public Record transform(RecordType recordType) throws Exception {
		LOG.debug("Transforming record: {}", recordType.getId());
		Record record = new Record();
		record.setId(recordType.getId());
		record.setDate(recordType.getDate().toGregorianCalendar().getTime());
		LOG.info("Transformed record: {}", recordType.getId());
		return record;
	}
}
