import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { openAIService } from "@/services/openai";
import { Loader2, TestTube } from "lucide-react";

export function TestOptimization() {
  const [prompt, setPrompt] = useState("Write a function to sort an array");
  const [tool, setTool] = useState("chatgpt");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testOptimization = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    console.log('🧪 Testing optimization with:', { prompt, tool });
    
    try {
      const response = await openAIService.optimizePrompt({ prompt, tool });
      console.log('✅ Test successful:', response);
      setResult(response);
    } catch (err) {
      console.error('❌ Test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            OpenAI Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-prompt">Test Prompt</Label>
              <Textarea
                id="test-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a test prompt..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-tool">Tool</Label>
              <Input
                id="test-tool"
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                placeholder="e.g., chatgpt, claude, react"
              />
            </div>
          </div>
          
          <Button 
            onClick={testOptimization}
            disabled={isLoading || !prompt.trim() || !tool.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing OpenAI Integration...
              </>
            ) : (
              "Test Optimization"
            )}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Error:</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✅ Success!</h4>
                <p className="text-sm text-green-700">OpenAI integration is working correctly.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optimized Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-gray-50 p-3 rounded border">
                      {result.optimizedPrompt}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong className="text-sm">Intent:</strong>
                      <p className="text-sm text-gray-600">{result.analysis.intent}</p>
                    </div>
                    <div>
                      <strong className="text-sm">Complexity:</strong>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        result.analysis.complexity === 'high' ? 'bg-red-100 text-red-700' :
                        result.analysis.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {result.analysis.complexity}
                      </span>
                    </div>
                    <div>
                      <strong className="text-sm">Requirements:</strong>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                        {result.analysis.requirements.map((req: string, idx: number) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-sm">Improvements:</strong>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                        {result.analysis.improvements.map((imp: string, idx: number) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">
            Open your browser's developer console (F12) to see detailed logs during the test.
          </p>
          <div className="bg-gray-50 p-3 rounded border text-xs font-mono">
            API Key: {import.meta.env.VITE_OPENAI_API_KEY ? 
              `${import.meta.env.VITE_OPENAI_API_KEY.substring(0, 10)}...` : 
              'NOT SET'
            }<br/>
            Model: {import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o'}<br/>
            Max Tokens: {import.meta.env.VITE_OPENAI_MAX_TOKENS || '2000'}<br/>
            Temperature: {import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}