import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { openAIService, type OptimizationResponse } from "@/services/openai";
import { 
  ArrowRight, Lightbulb, Target, Gauge, Wand2,
  Bot, Brain, MessageSquare, Zap, Code, Terminal, Globe, 
  Palette, Database, Server, Smartphone, Monitor, 
  FileCode, GitBranch, Package, Layers, Settings,
  Cloud, Shield, Search, Image, Video, Music,
  BarChart, PieChart, TrendingUp, Users, Mail,
  Calendar, Clock, FileText, Folder, Archive, Copy,
  AlertCircle, Loader2
} from "lucide-react";

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
  icon: React.ComponentType<any>;
}

const TOOLS: Record<string, ToolConfig> = {
  // AI Tools
  chatgpt: {
    name: "ChatGPT",
    color: "bg-green-500",
    description: "OpenAI's conversational AI assistant",
    icon: MessageSquare
  },
  claude: {
    name: "Claude",
    color: "bg-orange-500",
    description: "Anthropic's AI assistant focused on safety and helpfulness",
    icon: Bot
  },
  gemini: {
    name: "Google Gemini",
    color: "bg-blue-500",
    description: "Google's multimodal AI assistant",
    icon: Brain
  },
  copilot: {
    name: "GitHub Copilot",
    color: "bg-gray-800",
    description: "AI-powered code completion and assistance",
    icon: Code
  },
  midjourney: {
    name: "Midjourney",
    color: "bg-purple-500",
    description: "AI-powered image generation tool",
    icon: Image
  },
  dalle: {
    name: "DALL-E",
    color: "bg-pink-500",
    description: "OpenAI's image generation AI",
    icon: Palette
  },
  perplexity: {
    name: "Perplexity AI",
    color: "bg-indigo-500",
    description: "AI-powered search and research assistant",
    icon: Search
  },
  mistral: {
    name: "Mistral AI",
    color: "bg-red-500",
    description: "Open-source large language model",
    icon: Zap
  },
  grok: {
    name: "Grok",
    color: "bg-black",
    description: "xAI's conversational AI with real-time knowledge",
    icon: Bot
  },
  
  // IDEs and Code Editors
  vscode: {
    name: "Visual Studio Code",
    color: "bg-blue-600",
    description: "Microsoft's lightweight code editor",
    icon: Code
  },
  intellij: {
    name: "IntelliJ IDEA",
    color: "bg-orange-600",
    description: "JetBrains' Java IDE",
    icon: FileCode
  },
  webstorm: {
    name: "WebStorm",
    color: "bg-cyan-500",
    description: "JetBrains' JavaScript IDE",
    icon: Globe
  },
  pycharm: {
    name: "PyCharm",
    color: "bg-green-600",
    description: "JetBrains' Python IDE",
    icon: Terminal
  },
  eclipse: {
    name: "Eclipse",
    color: "bg-purple-600",
    description: "Open-source IDE for Java development",
    icon: Settings
  },
  sublime: {
    name: "Sublime Text",
    color: "bg-orange-400",
    description: "Sophisticated text editor for code",
    icon: FileText
  },
  atom: {
    name: "Atom",
    color: "bg-green-400",
    description: "GitHub's hackable text editor",
    icon: Package
  },
  vim: {
    name: "Vim",
    color: "bg-green-700",
    description: "Highly configurable text editor",
    icon: Terminal
  },
  emacs: {
    name: "Emacs",
    color: "bg-purple-700",
    description: "Extensible text editor",
    icon: FileCode
  },
  
  // Web Development Frameworks
  react: {
    name: "React",
    color: "bg-blue-400",
    description: "Facebook's JavaScript library for building UIs",
    icon: Layers
  },
  vue: {
    name: "Vue.js",
    color: "bg-green-500",
    description: "Progressive JavaScript framework",
    icon: Zap
  },
  angular: {
    name: "Angular",
    color: "bg-red-600",
    description: "Google's TypeScript-based web framework",
    icon: Shield
  },
  svelte: {
    name: "Svelte",
    color: "bg-orange-500",
    description: "Compile-time optimized web framework",
    icon: Zap
  },
  nextjs: {
    name: "Next.js",
    color: "bg-black",
    description: "React framework for production",
    icon: Globe
  },
  nuxt: {
    name: "Nuxt.js",
    color: "bg-green-600",
    description: "Vue.js framework for universal applications",
    icon: Server
  },
  gatsby: {
    name: "Gatsby",
    color: "bg-purple-600",
    description: "Static site generator for React",
    icon: Globe
  },
  
  // Backend and Database Tools
  nodejs: {
    name: "Node.js",
    color: "bg-green-600",
    description: "JavaScript runtime for server-side development",
    icon: Server
  },
  express: {
    name: "Express.js",
    color: "bg-gray-600",
    description: "Fast Node.js web application framework",
    icon: Server
  },
  mongodb: {
    name: "MongoDB",
    color: "bg-green-700",
    description: "NoSQL document database",
    icon: Database
  },
  postgresql: {
    name: "PostgreSQL",
    color: "bg-blue-700",
    description: "Advanced open-source relational database",
    icon: Database
  },
  mysql: {
    name: "MySQL",
    color: "bg-orange-600",
    description: "Popular open-source relational database",
    icon: Database
  },
  
  // Cloud and DevOps
  aws: {
    name: "Amazon AWS",
    color: "bg-orange-500",
    description: "Amazon's cloud computing platform",
    icon: Cloud
  },
  azure: {
    name: "Microsoft Azure",
    color: "bg-blue-600",
    description: "Microsoft's cloud computing platform",
    icon: Cloud
  },
  gcp: {
    name: "Google Cloud",
    color: "bg-blue-500",
    description: "Google's cloud computing platform",
    icon: Cloud
  },
  docker: {
    name: "Docker",
    color: "bg-blue-500",
    description: "Containerization platform",
    icon: Package
  },
  kubernetes: {
    name: "Kubernetes",
    color: "bg-blue-600",
    description: "Container orchestration platform",
    icon: Settings
  },
  
  // Version Control and Collaboration
  git: {
    name: "Git",
    color: "bg-orange-600",
    description: "Distributed version control system",
    icon: GitBranch
  },
  github: {
    name: "GitHub",
    color: "bg-gray-800",
    description: "Git repository hosting service",
    icon: GitBranch
  },
  gitlab: {
    name: "GitLab",
    color: "bg-orange-500",
    description: "DevOps platform with Git repository management",
    icon: GitBranch
  },
  
  // Mobile Development
  reactnative: {
    name: "React Native",
    color: "bg-blue-500",
    description: "Cross-platform mobile app development",
    icon: Smartphone
  },
  flutter: {
    name: "Flutter",
    color: "bg-blue-400",
    description: "Google's UI toolkit for mobile apps",
    icon: Smartphone
  },
  ionic: {
    name: "Ionic",
    color: "bg-blue-600",
    description: "Cross-platform mobile app framework",
    icon: Smartphone
  },
  
  // Design and Prototyping
  figma: {
    name: "Figma",
    color: "bg-purple-500",
    description: "Collaborative design and prototyping tool",
    icon: Palette
  },
  sketch: {
    name: "Sketch",
    color: "bg-orange-400",
    description: "Digital design toolkit for Mac",
    icon: Palette
  },
  adobexd: {
    name: "Adobe XD",
    color: "bg-pink-500",
    description: "UI/UX design and prototyping tool",
    icon: Palette
  },
  
  // Analytics and Monitoring
  googleanalytics: {
    name: "Google Analytics",
    color: "bg-orange-500",
    description: "Web analytics service",
    icon: BarChart
  },
  mixpanel: {
    name: "Mixpanel",
    color: "bg-blue-600",
    description: "Product analytics platform",
    icon: PieChart
  },
  hotjar: {
    name: "Hotjar",
    color: "bg-red-500",
    description: "User behavior analytics tool",
    icon: TrendingUp
  }
};

export function PromptOptimizer() {
  const [basePrompt, setBasePrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzePrompt = async () => {
    if (!basePrompt.trim() || !selectedTool) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await openAIService.optimizePrompt({
        prompt: basePrompt,
        tool: selectedTool
      });
      
      setAnalysis(result.analysis);
      setOptimizedPrompt(result.optimizedPrompt);
      
      toast({
        title: "Success!",
        description: "Prompt optimized successfully using GPT-4.1",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4" />
            <span>Powered by GPT-4.1 & Knowledge Base</span>
          </div>
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
                  {Object.entries(TOOLS).map(([key, tool]) => {
                    const IconComponent = tool.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${tool.color} flex items-center justify-center`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={analyzePrompt} 
              disabled={!basePrompt.trim() || !selectedTool || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing with GPT-4.1...
                </>
              ) : (
                "Analyze & Optimize with AI"
              )}
            </Button>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(optimizedPrompt);
                            toast({
                              title: "Copied!",
                              description: "Optimized prompt copied to clipboard.",
                            });
                          }}
                          className="h-8 px-2"
                          title="Copy optimized prompt"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Badge className="bg-primary text-primary-foreground flex items-center gap-2">
                          {TOOLS[selectedTool] && (() => {
                            const IconComponent = TOOLS[selectedTool].icon;
                            return <IconComponent className="h-3 w-3" />;
                          })()}
                          {TOOLS[selectedTool]?.name}
                        </Badge>
                      </div>
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