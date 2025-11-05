import React, { useState, useEffect } from 'react';

interface SsoProvider {
  id: string;
  name: string;
  type: string;
  status: string;
  logoUrl?: string;
  customization?: any;
}

export const SsoConfiguration: React.FC = () => {
  const [providers, setProviders] = useState<SsoProvider[]>([]);
  const [editingProvider, setEditingProvider] = useState<SsoProvider | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/admin/sso/providers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setProviders(await response.json());
  };

  const handleLogoUpload = async (providerId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    await fetch(`/api/admin/sso/providers/${providerId}/logo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    fetchProviders();
  };

  const handleCustomization = async (providerId: string, customization: any) => {
    const token = localStorage.getItem('authToken');
    await fetch(`/api/admin/sso/providers/${providerId}/customize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customization)
    });
    fetchProviders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">SSO Configuration</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add SSO Provider
        </button>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {provider.logoUrl && (
                  <img src={provider.logoUrl} alt={provider.name} className="w-12 h-12 object-contain" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                provider.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {provider.status}
              </span>
            </div>

            {/* Customization Preview */}
            {provider.customization && (
              <div className="mb-4 p-3 border rounded" style={{
                backgroundColor: provider.customization.primaryColor + '10',
                borderColor: provider.customization.primaryColor
              }}>
                <p className="text-sm font-medium" style={{ color: provider.customization.primaryColor }}>
                  {provider.customization.portalName}
                </p>
                <p className="text-xs text-gray-600">Portal Preview</p>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProvider(provider)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Configure
              </button>
              <label className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer">
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(provider.id, e.target.files[0])}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Configure {editingProvider.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Portal Name</label>
                <input
                  type="text"
                  defaultValue={editingProvider.customization?.portalName || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  onChange={(e) => {
                    const customization = { ...editingProvider.customization, portalName: e.target.value };
                    handleCustomization(editingProvider.id, customization);
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <input
                  type="color"
                  defaultValue={editingProvider.customization?.primaryColor || '#000000'}
                  className="mt-1 block w-full h-10 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const customization = { ...editingProvider.customization, primaryColor: e.target.value };
                    handleCustomization(editingProvider.id, customization);
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                <input
                  type="color"
                  defaultValue={editingProvider.customization?.secondaryColor || '#000000'}
                  className="mt-1 block w-full h-10 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const customization = { ...editingProvider.customization, secondaryColor: e.target.value };
                    handleCustomization(editingProvider.id, customization);
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setEditingProvider(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};