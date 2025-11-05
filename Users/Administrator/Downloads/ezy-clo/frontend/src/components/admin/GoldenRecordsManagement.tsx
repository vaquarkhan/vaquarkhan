import React, { useState, useEffect } from 'react';

interface GoldenRecord {
  id: string;
  customerId: string;
  confidence: number;
  status: string;
  sources: string[];
  attributes: any;
}

export const GoldenRecordsManagement: React.FC = () => {
  const [records, setRecords] = useState<GoldenRecord[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [dataQuality, setDataQuality] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    const [recordsRes, duplicatesRes, qualityRes] = await Promise.all([
      fetch('/api/admin/golden-records/customers', { headers }),
      fetch('/api/admin/golden-records/duplicates', { headers }),
      fetch('/api/admin/golden-records/data-quality', { headers })
    ]);

    setRecords(await recordsRes.json());
    setDuplicates(await duplicatesRes.json());
    setDataQuality(await qualityRes.json());
  };

  const handleMerge = async (recordIds: string[]) => {
    const token = localStorage.getItem('authToken');
    await fetch('/api/admin/golden-records/merge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recordIds })
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Golden Records Management</h2>

      {/* Data Quality Overview */}
      {dataQuality && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Data Quality Score</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{dataQuality.overallScore}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dataQuality.completeness}%</div>
              <div className="text-sm text-gray-600">Completeness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dataQuality.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{dataQuality.consistency}%</div>
              <div className="text-sm text-gray-600">Consistency</div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Records */}
      {duplicates.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Duplicate Records Requiring Review</h3>
          {duplicates.map((group) => (
            <div key={group.groupId} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Confidence: {group.confidence}%</span>
                <button
                  onClick={() => handleMerge(group.records.map((r: any) => r.id))}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Merge Records
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.records.map((record: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">{record.name}</div>
                    <div className="text-sm text-gray-600">Source: {record.source}</div>
                    <div className="text-sm text-gray-600">ID: {record.id}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Golden Records Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Golden Records</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {records.map((record) => (
            <li key={record.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{record.attributes.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Confidence: {record.confidence}%</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Email: {record.attributes.email}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Segment: {record.attributes.segment}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      Sources: {record.sources.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};