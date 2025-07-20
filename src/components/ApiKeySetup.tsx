import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { openAIService } from "@/services/openai";
import { Key, CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react";

interface ApiKeySetupProps {
  onApiKeyConfigured: () => void;
}

export function ApiKeySetup({ onApiKeyConfigured }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    // Check if API key is already configured
    const existingKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (existingKey && existingKey !== 'your_openai_api_key_here') {
      setHasExistingKey(true);
      testExistingConnection();
    }
  }, []);

  const testExistingConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await openAIService.testConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
      if (isConnected) {
        setTimeout(() => onApiKeyConfigured(), 1000);
      }
    } catch {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testConnection = async () => {
    if (!apiKey.trim()) return;
    
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    // Temporarily set the API key for testing
    const originalKey = import.meta.env.VITE_OPENAI_API_KEY;
    (import.meta.env as any).VITE_OPENAI_API_KEY = apiKey;
    
    try {
      const isConnected = await openAIService.testConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
      
      if (isConnected) {
        setTimeout(() => onApiKeyConfigured(), 1000);
      }
    } catch {
      setConnectionStatus('error');
    } finally {
      // Restore original key if test failed
      if (connectionStatus === 'error') {
        (import.meta.env as any).VITE_OPENAI_API_KEY = originalKey;
      }
      setIsTestingConnection(false);
    }
  };

  if (hasExistingKey && connectionStatus === 'success') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>OpenAI API connected successfully!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Configuration
          </CardTitle>
          <p className="text-muted-foreground">
            Configure your OpenAI API key to start optimizing prompts with GPT-4.1
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasExistingKey && connectionStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">
                Existing API key configuration failed. Please check your .env file or enter a new key below.
              </span>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <Button 
              onClick={testConnection}
              disabled={!apiKey.trim() || isTestingConnection}
              className="w-full"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                "Test & Configure API Key"
              )}
            </Button>
            
            {connectionStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Connection successful! Redirecting...</span>
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">
                  Connection failed. Please check your API key and try again.
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-medium text-sm">How to get your OpenAI API Key:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Visit the OpenAI Platform</li>
              <li>Sign in to your account or create a new one</li>
              <li>Navigate to API Keys section</li>
              <li>Create a new secret key</li>
              <li>Copy and paste it above</li>
            </ol>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Get API Key
              </a>
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-sm text-blue-900 mb-2">Alternative: Environment Variable</h4>
            <p className="text-xs text-blue-700 mb-2">
              You can also set your API key in the .env file:
            </p>
            <code className="text-xs bg-blue-100 p-2 rounded block text-blue-800">
              VITE_OPENAI_API_KEY=your_actual_api_key_here
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}