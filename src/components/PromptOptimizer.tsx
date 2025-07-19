import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Lightbulb, Target, Gauge, Wand2 } from "lucide-react";

interface PromptAnalysis {
  intent: string;
  complexity: "low" | "medium" | "high";
  requirements: string[];
  improvements: string[];
}

interface ToolConfig {
  name: string;
  color: string;
  description: string;
}

const TOOLS: Record<string, ToolConfig> = {
  chatgpt: {
    name: "ChatGPT",
    color: "tool-chatgpt",
    description: "Conversational AI optimized for detailed responses"
  },
  claude: {
    name: "Claude",
    color: "tool-claude", 
    description: "Anthropic's AI focused on helpful, harmless responses"
  },
  midjourney: {
    name: "Midjourney",
    color: "tool-midjourney",
    description: "AI image generation with artistic focus"
  }
};

export function PromptOptimizer() {
  const [basePrompt, setBasePrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePrompt = async () => {
    if (!basePrompt.trim() || !selectedTool) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const wordCount = basePrompt.split(" ").length;
      const complexity = wordCount > 20 ? "high" : wordCount > 10 ? "medium" : "low";
      
      const mockAnalysis: PromptAnalysis = {
        intent: basePrompt.includes("?") ? "Question/Information seeking" : 
                basePrompt.includes("create") || basePrompt.includes("generate") ? "Content creation" :
                "Task completion",
        complexity,
        requirements: [
          "Clear context",
          "Specific output format",
          "Detailed instructions"
        ],
        improvements: [
          "Add specific context",
          "Define expected output format", 
          "Include examples",
          "Specify constraints"
        ]
      };

      setAnalysis(mockAnalysis);
      
      // Generate optimized prompt based on tool
      let optimized = "";
      switch (selectedTool) {
        case "chatgpt":
          optimized = `You are an expert assistant. ${basePrompt}\n\nPlease provide a detailed response with:\n1. Clear explanations\n2. Specific examples\n3. Step-by-step guidance when applicable`;
          break;
        case "claude":
          optimized = `${basePrompt}\n\nPlease respond thoughtfully and helpfully, considering:\n- Accuracy and reliability\n- Potential implications\n- Clear reasoning`;
          break;
        case "midjourney":
          optimized = `${basePrompt}, highly detailed, professional photography, 8k resolution, dramatic lighting, cinematic composition --ar 16:9 --v 6`;
          break;
        default:
          optimized = basePrompt;
      }
      
      setOptimizedPrompt(optimized);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "analysis-low";
      case "medium": return "analysis-medium"; 
      case "high": return "analysis-high";
      default: return "muted";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Prompt Optimizer</h1>
          <p className="text-muted-foreground">Enhance your prompts for better AI responses</p>
        </div>

        {/* Input Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Input Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Base Prompt</label>
              <Textarea
                placeholder="Enter your prompt here..."
                value={basePrompt}
                onChange={(e) => setBasePrompt(e.target.value)}
                className="min-h-[120px] border-input-border"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Tool</label>
              <Select value={selectedTool} onValueChange={setSelectedTool}>
                <SelectTrigger className="border-input-border">
                  <SelectValue placeholder="Select an AI tool" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TOOLS).map(([key, tool]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${tool.color}`} />
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-muted-foreground">{tool.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={analyzePrompt} 
              disabled={!basePrompt.trim() || !selectedTool || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze & Optimize"}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <>
            {/* Analysis Section */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Prompt Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Intent</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.intent}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Complexity</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`bg-${getComplexityColor(analysis.complexity)} text-foreground`}
                    >
                      {analysis.complexity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Requirements</span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <span className="text-sm font-medium">Suggested Improvements</span>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Section */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Before & After Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">Original Prompt</h3>
                      <Badge variant="outline">Base</Badge>
                    </div>
                    <div className="bg-card-secondary p-4 rounded-lg border">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{basePrompt}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">Optimized Prompt</h3>
                      <Badge className="bg-primary text-primary-foreground">
                        {TOOLS[selectedTool]?.name}
                      </Badge>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{optimizedPrompt}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Key Optimizations Applied</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-primary">Structure Improvements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Added clear context setting</li>
                        <li>• Included specific output format</li>
                        <li>• Enhanced instruction clarity</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-primary">Tool-Specific Enhancements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Optimized for {TOOLS[selectedTool]?.name} capabilities</li>
                        <li>• Added relevant parameters</li>
                        <li>• Improved response guidance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}