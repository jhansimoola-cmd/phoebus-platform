
export enum ConnectionType {
  DATABASE = 'DATABASE',
  CRM = 'CRM',
  REST_API = 'REST_API',
  WEBHOOK = 'WEBHOOK'
}

export interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  config: Record<string, string>;
  status: 'connected' | 'error' | 'pending';
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  connectionId?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  tools: string[]; // IDs of tools
  model: string;
  type: 'standard' | 'super';
}

export interface Message {
  role: 'user' | 'model' | 'system' | 'tool';
  content: string;
  timestamp: Date;
}
