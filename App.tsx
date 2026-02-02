
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AgentBuilder from './components/AgentBuilder';
import ToolsManager from './components/ToolsManager';
import ChatSandbox from './components/ChatSandbox';
import { Agent, Tool, Connection, ConnectionType } from './types';

const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Customer Support Lead',
    role: 'Helpful expert at handling customer queries and ticketing.',
    description: 'Manages first-line customer inquiries with tool integration.',
    systemInstruction: 'You are an elite customer support specialist. Your goal is to solve problems effectively. Use the provided tools to check status before answering. If you cannot solve it, suggest escalation.',
    tools: ['t1'],
    model: 'gemini-3-flash-preview',
    type: 'standard'
  },
  {
    id: '2',
    name: 'Orchestrator Pro',
    role: 'High-level multi-agent manager.',
    description: 'A Super Agent that can delegate tasks to specialized sub-agents.',
    systemInstruction: 'You are a Super Agent. Your job is to decompose complex user requests and assign them to the appropriate specialized sub-agents or use tools directly. Always provide a synthesized final answer.',
    tools: ['t1', 't2'],
    model: 'gemini-3-pro-preview',
    type: 'super'
  }
];

const INITIAL_TOOLS: Tool[] = [
  {
    id: 't1',
    name: 'check_order_status',
    description: 'Retrieve tracking details for a specific order ID.',
    parameters: [
      { name: 'order_id', type: 'string', description: 'The unique order identifier', required: true }
    ]
  },
  {
    id: 't2',
    name: 'update_crm_lead',
    description: 'Update lead status or notes in the CRM system.',
    parameters: [
      { name: 'email', type: 'string', description: 'Customer email address', required: true },
      { name: 'notes', type: 'string', description: 'Engagement notes', required: false }
    ]
  }
];

const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'c1',
    name: 'PostgreSQL Production',
    type: ConnectionType.DATABASE,
    config: {},
    status: 'connected'
  },
  {
    id: 'c2',
    name: 'HubSpot Marketing',
    type: ConnectionType.CRM,
    config: {},
    status: 'connected'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'tools' | 'connections' | 'analytics' | 'sandbox'>('dashboard');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);

  const handleSaveAgent = (updatedAgent: Agent) => {
    setAgents(prev => {
      const exists = prev.find(a => a.id === updatedAgent.id);
      if (exists) return prev.map(a => a.id === updatedAgent.id ? updatedAgent : a);
      return [...prev, updatedAgent];
    });
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-sm font-medium">Active Agents</p>
                   <h3 className="text-3xl font-bold text-slate-900 mt-1">{agents.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-sm font-medium">Enabled Skills</p>
                   <h3 className="text-3xl font-bold text-slate-900 mt-1">{tools.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-sm font-medium">Total Tokens Used</p>
                   <h3 className="text-3xl font-bold text-slate-900 mt-1">1.2M</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-sm font-medium">Success Rate</p>
                   <h3 className="text-3xl font-bold text-emerald-600 mt-1">98.2%</h3>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center">
                   <p className="text-slate-400 font-medium">Activity Analytics Visualization</p>
                   <div className="w-full flex-1 flex items-end justify-between gap-4 mt-8 px-4">
                      {[40, 70, 45, 90, 65, 80, 50, 85, 95, 30].map((h, i) => (
                        <div key={i} className="bg-indigo-500 w-full rounded-t-lg transition-all hover:bg-indigo-400 cursor-pointer" style={{height: `${h}%`}} />
                      ))}
                   </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-96 overflow-hidden">
                   <h4 className="font-bold text-slate-800 mb-6">Recent Agent Activity</h4>
                   <div className="space-y-4">
                      {['Customer Support Lead handled refund', 'Orchestrator called search_inventory', 'Sales Lead generated lead info'].map((activity, i) => (
                        <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all cursor-default">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                           <div>
                              <p className="text-sm text-slate-700 font-medium">{activity}</p>
                              <p className="text-xs text-slate-400">2 mins ago</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        );
      case 'agents':
        return <AgentBuilder agents={agents} tools={tools} onSave={handleSaveAgent} onDelete={handleDeleteAgent} />;
      case 'tools':
      case 'connections':
        return (
          <ToolsManager 
            tools={tools} 
            connections={connections} 
            onAddTool={t => setTools([...tools, t])}
            onAddConnection={c => setConnections([...connections, c])}
          />
        );
      case 'sandbox':
        return <ChatSandbox agents={agents} tools={tools} />;
      default:
        return <div className="p-12 text-center text-slate-400">Feature coming soon...</div>;
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen text-slate-900">
      <Sidebar activeItem={activeTab} onNavigate={setActiveTab} />
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">Control Plane</h1>
            <p className="text-3xl font-extrabold text-slate-900 capitalize">{activeTab}</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               System Operational
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
          </div>
        </header>

        <section className="h-[calc(100vh-200px)]">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default App;
