
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Agent, Tool, Message } from "../types";

export class GeminiAgentService {
  /**
   * Helper to map application tools to Gemini's FunctionDeclaration format.
   * @param tools - Array of application tool definitions.
   * @returns Array of FunctionDeclarations for the Gemini API.
   */
  private mapToolsToGemini(tools: Tool[]) {
    return tools.map(t => ({
      name: t.name,
      description: t.description,
      parameters: {
        type: Type.OBJECT,
        properties: t.parameters.reduce((acc, p) => {
          acc[p.name] = {
            type: p.type === 'string' ? Type.STRING : p.type === 'number' ? Type.NUMBER : Type.BOOLEAN,
            description: p.description
          };
          return acc;
        }, {} as any),
        required: t.parameters.filter(p => p.required).map(p => p.name)
      }
    }));
  }

  /**
   * Executes an agent task using the Gemini model.
   * Instantiates GoogleGenAI just-in-time to ensure it uses the latest configured API_KEY.
   */
  async runAgent(agent: Agent, tools: Tool[], prompt: string, history: Message[]): Promise<GenerateContentResponse> {
    // ALWAYS use new GoogleGenAI({ apiKey: process.env.API_KEY }) right before making an API call.
    // This ensures the application uses the most up-to-date API key from the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const modelName = agent.model || 'gemini-3-flash-preview';
    const mappedTools = this.mapToolsToGemini(tools);

    // Map message history to Gemini's content format.
    const contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Add the current user prompt to the contents array.
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    try {
      // Use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: agent.systemInstruction,
          // Pass function declarations as tools to enable functional capabilities.
          tools: mappedTools.length > 0 ? [{ functionDeclarations: mappedTools }] : undefined,
        }
      });

      return response;
    } catch (error) {
      console.error("Gemini Agent Error:", error);
      throw error;
    }
  }
}
