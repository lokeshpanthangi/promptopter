import { useState, useEffect } from "react";
import { PromptOptimizer } from "@/components/PromptOptimizer";
import { ApiKeySetup } from "@/components/ApiKeySetup";

const Index = () => {
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  
  useEffect(() => {
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      setIsApiConfigured(true);
    }
  }, []);
  
  if (!isApiConfigured) {
    return <ApiKeySetup onApiKeyConfigured={() => setIsApiConfigured(true)} />;
  }
  
  return <PromptOptimizer />;
};

export default Index;
