import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [customerMetrics, setCustomerMetrics] = useState<any>(null);
  const [offerPerformance, setOfferPerformance] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    const [summaryRes, customerRes, offerRes] = await Promise.all([
      fetch('/api/admin/analytics/executive-summary', { headers }),
      fetch('/api/admin/analytics/customer-metrics', { headers }),
      fetch('/api/admin/analytics/offer-performance', { headers })
    ]);

    setSummary(await summaryRes.json());
    setCustomerMetrics(await customerRes.json());
    setOfferPerformance(await offerRes.json());
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const segmentData = customerMetrics ? Object.entries(customerMetrics.segmentDistribution).map(([name, value]) => ({ name, value })) : [];
  const categoryData = offerPerformance ? Object.entries(offerPerformance.categoryPerformance).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      {/* Executive Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900">Total Customers</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.totalCustomers.toLocaleString()}</p>
            <p className="text-sm text-blue-700">+{summary.customerGrowthRate}% growth</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-green-900">Active Offers</h3>
            <p className="text-3xl font-bold text-green-600">{summary.activeOffers}</p>
            <p className="text-sm text-green-700">{summary.offerPerformanceRate}% performance</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-purple-900">Total Redemptions</h3>
            <p className="text-3xl font-bold text-purple-600">{summary.totalRedemptions.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-900">Revenue Generated</h3>
            <p className="text-3xl font-bold text-yellow-600">${summary.revenueGenerated.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Offer Performance by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Offer Performance by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      {customerMetrics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Customer Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold">{customerMetrics.activeCustomers.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold">{customerMetrics.customerRetentionRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Spend per Customer</p>
              <p className="text-2xl font-bold">${customerMetrics.avgSpendPerCustomer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};