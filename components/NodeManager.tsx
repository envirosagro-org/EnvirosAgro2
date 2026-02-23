import React, { useState, useEffect } from 'react';
import { Node } from '../types';
import { listenToCollection, createNode } from '../services/firebaseService';
import {cpu, rss, memory, server, hardDrive, gauge, activity, wifi, wifiOff, plusCircle } from 'lucide-react';

interface NodeManagerProps {
  stewardId: string;
}

const NodeManager: React.FC<NodeManagerProps> = ({ stewardId }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newNodeHardware, setNewNodeHardware] = useState('EOS-HW-002');
  const [newNodeLocation, setNewNodeLocation] = useState({ latitude: 0.0, longitude: 0.0 });

  useEffect(() => {
    const unsubscribe = listenToCollection(
      'nodes',
      (items: any[]) => {
        setNodes(items as Node[]);
        setLoading(false);
      },
      false // We only want nodes for the current steward
    );
    return () => unsubscribe();
  }, [stewardId]);

  const handleCreateNode = async () => {
    setIsCreating(true);
    const nodeData: Omit<Node, 'id'> = {
        stewardId: stewardId,
        hardware_type: newNodeHardware,
        status: 'OFFLINE',
        location: newNodeLocation,
        last_heartbeat: new Date().toISOString(),
        telemetry_summary: {},
    };
    await createNode(nodeData);
    setIsCreating(false);
  };

  const renderNodeStatus = (status: Node['status']) => {
    switch (status) {
      case 'ONLINE':
        return <span className="text-green-400"><wifi size={16} /> ONLINE</span>;
      case 'OFFLINE':
        return <span className="text-red-400"><wifiOff size={16} /> OFFLINE</span>;
      case 'SYNCING':
        return <span className="text-yellow-400"><activity size={16} /> SYNCING</span>;
      case 'STRESSED':
          return <span className="text-orange-400"><gauge size={16} /> STRESSED</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Node Manager</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map(node => (
          <div key={node.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{node.hardware_type}</h3>
                {renderNodeStatus(node.status)}
            </div>
            <div className="text-sm text-gray-400">ID: {node.id}</div>
            <div className="mt-4">
                <p className="text-sm flex items-center"><server size={16} className="mr-2"/> Telemetry:</p>
                <pre className="text-xs bg-gray-900 p-2 rounded mt-1">
                    {JSON.stringify(node.telemetry_summary, null, 2)}
                </pre>
            </div>
          </div>
        ))}
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold mb-2">Create New Node</h3>
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-400">Hardware Type</label>
                <input 
                    type="text" 
                    value={newNodeHardware}
                    onChange={(e) => setNewNodeHardware(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1"
                />
            </div>
            <button 
                onClick={handleCreateNode}
                disabled={isCreating}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
            >
                {isCreating ? <span className="animate-spin"><rss size={16}/></span> : <plusCircle size={16} />}
                <span className="ml-2">{isCreating ? 'Provisioning...' : 'Create Node'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default NodeManager;
