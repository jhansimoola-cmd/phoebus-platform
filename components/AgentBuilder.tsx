
import React, { useState } from 'react';
import { Agent, Tool } from '../types';

interface AgentBuilderProps {
  agents: Agent[];
  tools: Tool[];
  onSave: (agent: Agent) => void;
  onDelete: (id: string) => void;
}

const AgentBuilder: React.FC<AgentBuilderProps> = ({ agents, tools, onSave, onDelete }) => {
  const [editingAgent, setEditingAgent] = useState<Partial<Agent> | null>(null);

  const handleCreate = () => {
    setEditingAgent({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      role: '',
      description: '',
      systemInstruction: '',
      tools: [],
      model: 'gemini-3-flash-preview',
      type: 'standard'
    });
  };

  const save = () => {
    if (editingAgent && editingAgent.name && editingAgent.id) {
      onSave(editingAgent as Agent);
      setEditingAgent(null);
    }
  };

  const toggleTool = (toolId: string) => {
    if (!editingAgent) return;
    const currentTools = editingAgent.tools || [];
    if (currentTools.includes(toolId)) {
      setEditingAgent({ ...editingAgent, tools: currentTools.filter(id => id !== toolId) });
    } else {
      setEditingAgent({ ...editingAgent, tools: [...currentTools, toolId] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agents</h2>
          <p className="text-slate-500">Configure and orchestrate your autonomous AI workforces.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Build New Agent
        </button>
      </div>

      {editingAgent ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between mb-8">
             <h3 className="text-xl font-semibold">Configure Agent</h3>
             <button onClick={() => setEditingAgent(null)} className="text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
                <input 
                  type="text" 
                  value={editingAgent.name || ''} 
                  onChange={e => setEditingAgent({...editingAgent, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Sales Concierge"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role / Persona</label>
                <input 
                  type="text" 
                  value={editingAgent.role || ''} 
                  onChange={e => setEditingAgent({...editingAgent, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Expert Customer Support Agent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model Engine</label>
                <select 
                  value={editingAgent.model || 'gemini-3-flash-preview'}
                  onChange={e => setEditingAgent({...editingAgent, model: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Smart)</option>
                  <option value="gemini-2.5-flash-lite-latest">Gemini 2.5 Flash Lite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">System Instructions</label>
                <textarea 
                  rows={6}
                  value={editingAgent.systemInstruction || ''} 
                  onChange={e => setEditingAgent({...editingAgent, systemInstruction: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Describe exactly how this agent should behave..."
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Enable Tools & Skills</label>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 max-h-[400px] overflow-y-auto space-y-2">
                {tools.map(tool => (
                  <label key={tool.id} className="flex items-start gap-3 p-3 bg-white rounded-md border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={editingAgent.tools?.includes(tool.id) || false}
                      onChange={() => toggleTool(tool.id)}
                      className="mt-1 w-4 h-4 text-indigo-600" 
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tool.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={save}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700"
                >
                  Deploy Agent
                </button>
                <button 
                  onClick={() => setEditingAgent(null)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group relative">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${agent.type === 'super' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{agent.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{agent.type} Agent</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-4">{agent.role}</p>
              <div className="flex flex-wrap gap-1 mb-6">
                {agent.tools.slice(0, 3).map(toolId => (
                  <span key={toolId} className="px-2 py-0.5 bg-slate-100 text-[10px] rounded-full text-slate-600 font-medium border border-slate-200">
                    {tools.find(t => t.id === toolId)?.name || 'Unknown Tool'}
                  </span>
                ))}
                {agent.tools.length > 3 && <span className="text-[10px] text-slate-400">+{agent.tools.length - 3} more</span>}
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                 <button onClick={() => setEditingAgent(agent)} className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">Edit Configuration</button>
                 <button onClick={() => onDelete(agent.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentBuilder;
