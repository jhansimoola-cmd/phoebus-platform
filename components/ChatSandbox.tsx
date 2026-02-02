
import React, { useState, useRef, useEffect } from 'react';
import { Agent, Tool, Message } from '../types';
import { GeminiAgentService } from '../services/geminiService';

interface ChatSandboxProps {
  agents: Agent[];
  tools: Tool[];
}

const ChatSandbox: React.FC<ChatSandboxProps> = ({ agents, tools }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const serviceRef = useRef(new GeminiAgentService());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !selectedAgentId || isLoading) return;

    const currentAgent = agents.find(a => a.id === selectedAgentId);
    if (!currentAgent) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const agentTools = tools.filter(t => currentAgent.tools.includes(t.id));
      const response = await serviceRef.current.runAgent(
        currentAgent, 
        agentTools, 
        input, 
        messages.slice(-10) // Context window
      );

      const botMessage: Message = {
        role: 'model',
        content: response.text || 'Thinking...',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Error communicating with agent. Check API logs.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-slate-800">Agent Sandbox</h3>
        </div>
        <select 
          value={selectedAgentId}
          onChange={e => setSelectedAgentId(e.target.value)}
          className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {agents.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
             <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             <p className="text-lg font-medium">Select an agent and start a conversation</p>
             <p className="text-sm">This sandbox uses real Gemini API for reasoning.</p>
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 
              m.role === 'system' ? 'bg-red-50 text-red-600 border border-red-100 italic' :
              'bg-slate-100 text-slate-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              <p className="text-[10px] mt-1 opacity-50">{m.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl p-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message to test agent capabilities..."
            className="w-full pl-4 pr-24 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSandbox;
