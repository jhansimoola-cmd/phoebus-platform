
import React, { useState } from 'react';
import { Tool, Connection, ConnectionType } from '../types';

interface ToolsManagerProps {
  tools: Tool[];
  connections: Connection[];
  onAddTool: (tool: Tool) => void;
  onAddConnection: (conn: Connection) => void;
}

const ToolsManager: React.FC<ToolsManagerProps> = ({ tools, connections, onAddTool, onAddConnection }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'integrations'>('tools');
  const [showNewTool, setShowNewTool] = useState(false);
  const [showNewConn, setShowNewConn] = useState(false);

  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: '', description: '', parameters: [], connectionId: ''
  });

  const [newConn, setNewConn] = useState<Partial<Connection>>({
    name: '', type: ConnectionType.REST_API, config: {}, status: 'connected'
  });

  const handleAddParam = () => {
    setNewTool({
      ...newTool,
      parameters: [...(newTool.parameters || []), { name: '', type: 'string', description: '', required: true }]
    });
  };

  const saveTool = () => {
    if (newTool.name && newTool.description) {
      onAddTool({
        id: Math.random().toString(36).substr(2, 9),
        name: newTool.name,
        description: newTool.description,
        parameters: newTool.parameters || [],
        connectionId: newTool.connectionId
      } as Tool);
      setShowNewTool(false);
      setNewTool({ name: '', description: '', parameters: [] });
    }
  };

  const saveConn = () => {
    if (newConn.name) {
      onAddConnection({
        id: Math.random().toString(36).substr(2, 9),
        name: newConn.name,
        type: newConn.type || ConnectionType.REST_API,
        config: newConn.config || {},
        status: 'connected'
      } as Connection);
      setShowNewConn(false);
      setNewConn({ name: '', type: ConnectionType.REST_API });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('tools')}
          className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'tools' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          Functional Tools
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'integrations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          Data Integrations
        </button>
      </div>

      {activeTab === 'tools' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Available Skills</h3>
            <button 
              onClick={() => setShowNewTool(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              + Create New Tool
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map(tool => (
              <div key={tool.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{tool.name}</h4>
                  <p className="text-sm text-slate-500">{tool.description}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 font-bold uppercase">{tool.parameters.length} Parameters</span>
                    {tool.connectionId && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 font-bold uppercase">Active Integration</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showNewTool && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">Define Functional Tool</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tool Name</label>
                      <input 
                        type="text" 
                        value={newTool.name}
                        onChange={e => setNewTool({...newTool, name: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., search_inventory"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description (Be specific for AI understanding)</label>
                      <textarea 
                        value={newTool.description}
                        onChange={e => setNewTool({...newTool, description: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Retrieves current stock levels for a given SKU..."
                      />
                    </div>
                    
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-slate-700">Required Parameters</label>
                          <button onClick={handleAddParam} className="text-indigo-600 text-xs font-bold">+ Add Param</button>
                       </div>
                       <div className="space-y-3">
                          {newTool.parameters?.map((p, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                               <input 
                                 placeholder="Name" 
                                 className="w-1/4 px-2 py-1 text-sm rounded border border-slate-200"
                                 value={p.name}
                                 onChange={e => {
                                   const newParams = [...(newTool.parameters || [])];
                                   newParams[idx].name = e.target.value;
                                   setNewTool({...newTool, parameters: newParams});
                                 }}
                               />
                               <select 
                                 className="w-1/4 px-2 py-1 text-sm rounded border border-slate-200"
                                 value={p.type}
                                 onChange={e => {
                                   const newParams = [...(newTool.parameters || [])];
                                   newParams[idx].type = e.target.value as any;
                                   setNewTool({...newTool, parameters: newParams});
                                 }}
                               >
                                 <option value="string">String</option>
                                 <option value="number">Number</option>
                                 <option value="boolean">Boolean</option>
                               </select>
                               <input 
                                 placeholder="Desc" 
                                 className="flex-1 px-2 py-1 text-sm rounded border border-slate-200"
                                 value={p.description}
                                 onChange={e => {
                                   const newParams = [...(newTool.parameters || [])];
                                   newParams[idx].description = e.target.value;
                                   setNewTool({...newTool, parameters: newParams});
                                 }}
                               />
                               <button 
                                 onClick={() => setNewTool({...newTool, parameters: newTool.parameters?.filter((_, i) => i !== idx)})}
                                 className="text-red-400"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                      <button onClick={saveTool} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">Register Tool</button>
                      <button onClick={() => setShowNewTool(false)} className="flex-1 border border-slate-200 py-2 rounded-lg text-slate-600">Cancel</button>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Connected Systems</h3>
            <button 
              onClick={() => setShowNewConn(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              + Add Connection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {connections.map(conn => (
               <div key={conn.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-slate-50 rounded-lg">
                        {conn.type === ConnectionType.DATABASE && <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
                        {conn.type === ConnectionType.CRM && <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        {conn.type === ConnectionType.REST_API && <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                     </div>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${conn.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {conn.status}
                     </span>
                  </div>
                  <h4 className="font-bold text-slate-800">{conn.name}</h4>
                  <p className="text-xs text-slate-400 mb-4">{conn.type}</p>
                  <button className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100">Configure Endpoints</button>
               </div>
             ))}
          </div>

          {showNewConn && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                 <h3 className="text-2xl font-bold mb-6">New Integration</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Integration Name</label>
                      <input 
                        type="text" 
                        value={newConn.name}
                        onChange={e => setNewConn({...newConn, name: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                        placeholder="e.g., Salesforce Production"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">System Type</label>
                      <select 
                        value={newConn.type}
                        onChange={e => setNewConn({...newConn, type: e.target.value as ConnectionType})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                      >
                         <option value={ConnectionType.REST_API}>REST API / GraphQL</option>
                         <option value={ConnectionType.CRM}>CRM (Salesforce, HubSpot)</option>
                         <option value={ConnectionType.DATABASE}>Database (PostgreSQL, MongoDB)</option>
                         <option value={ConnectionType.WEBHOOK}>Webhook Trigger</option>
                      </select>
                    </div>
                    <div className="pt-6 flex gap-4">
                      <button onClick={saveConn} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold">Connect System</button>
                      <button onClick={() => setShowNewConn(false)} className="flex-1 border border-slate-200 py-2 rounded-lg text-slate-600">Cancel</button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsManager;
