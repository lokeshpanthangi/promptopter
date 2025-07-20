import knowledgeBase from '../../Knowledge.json';

interface OptimizationRequest {
  prompt: string;
  tool: string;
}

interface OptimizationResponse {
  optimizedPrompt: string;
  analysis: {
    intent: string;
    complexity: 'low' | 'medium' | 'high';
    requirements: string[];
    improvements: string[];
  };
}

class OpenAIService {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o';
    this.maxTokens = parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 2000;
    this.temperature = parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.7;
  }

  private validateConfig(): void {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
    }
  }

  private getToolOptimizationStrategies(tool: string): string[] {
    const toolData = knowledgeBase.tools[tool as keyof typeof knowledgeBase.tools];
    return toolData?.optimizationStrategies || [];
  }

  private createSystemPrompt(tool: string): string {
    const strategies = this.getToolOptimizationStrategies(tool);
    const toolName = knowledgeBase.tools[tool as keyof typeof knowledgeBase.tools]?.name || tool;

    return `You are an expert prompt engineer specializing in optimizing prompts for ${toolName}.

Your task is to:
1. Analyze the given prompt
2. Apply the following optimization strategies specific to ${toolName}:
${strategies.map(strategy => `   - ${strategy}`).join('\n')}
3. Provide an optimized version of the prompt
4. Analyze the prompt's intent, complexity, requirements, and improvements

Please respond in the following JSON format:
{
  "optimizedPrompt": "The improved prompt here",
  "analysis": {
    "intent": "Brief description of what the user wants to achieve",
    "complexity": "low|medium|high",
    "requirements": ["requirement1", "requirement2"],
    "improvements": ["improvement1", "improvement2"]
  }
}

Ensure the optimized prompt is significantly better than the original while maintaining the user's intent.`;
  }

  async optimizePrompt({ prompt, tool }: OptimizationRequest): Promise<OptimizationResponse> {
    this.validateConfig();

    console.log('🚀 Starting optimization for tool:', tool);
    console.log('📋 API Key configured:', this.apiKey ? 'Yes' : 'No');

    try {
      const systemPrompt = this.createSystemPrompt(tool);
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please optimize this prompt for ${tool}: "${prompt}"`
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      };

      console.log('📤 Sending request to OpenAI API...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ OpenAI API Error:', response.status, errorData.error?.message);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ OpenAI API call successful');
      
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content received from OpenAI');
      }

      try {
        const result = JSON.parse(content);
        console.log('✨ Prompt optimization completed successfully');
        
        return {
          optimizedPrompt: result.optimizedPrompt || prompt,
          analysis: {
            intent: result.analysis?.intent || 'General task completion',
            complexity: result.analysis?.complexity || 'medium',
            requirements: result.analysis?.requirements || ['Clear instructions'],
            improvements: result.analysis?.improvements || ['Enhanced clarity']
          }
        };
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response:', parseError);
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (error) {
      console.error('💥 OpenAI API call failed:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async testConnection(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return false;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

export const openAIService = new OpenAIService();
export type { OptimizationRequest, OptimizationResponse };