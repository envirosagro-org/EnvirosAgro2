
import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { Loader2, Zap, Leaf, Shield } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, nodeData, loading, simulating, error, handleSimulateUpdate } = useUserProfile();

  if (loading || !user) {
    return <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Steward Profile & Farm Node Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-md">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Leaf size={20} /> User Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ESIN:</strong> {user.esin}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-md">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Shield size={20} /> Sustainability Metrics</h3>
          {nodeData && nodeData.sustainability_metrics ? (
            <>
              <p><strong>Agro Code (C(a)):</strong> {nodeData.sustainability_metrics.ca_value.toFixed(2)}</p>
              <p><strong>m-constant:</strong> {nodeData.sustainability_metrics.m_constant.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-2">Last Updated: {new Date(nodeData.last_updated.seconds * 1000).toLocaleString()}</p>
            </>
          ) : (
            <p>No sustainability data available.</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <button 
          onClick={handleSimulateUpdate} 
          disabled={simulating}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500"
        >
          {simulating ? <><Loader2 className="animate-spin" /> Simulating...</> : <><Zap size={20} /> Simulate Farm OS Update</>}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
