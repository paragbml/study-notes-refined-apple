
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setResponse("");
      
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Perplexity API key in the settings.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI research assistant for students. Provide concise, accurate answers with citations when possible.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setResponse(data.choices[0].message.content);
      
    } catch (error) {
      console.error('Error querying Perplexity API:', error);
      toast({
        title: "Error",
        description: "Failed to get a response from Perplexity AI. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center mb-4">
        <Bot className="h-5 w-5 mr-2" />
        <h2 className="text-lg font-medium">AI Research Assistant</h2>
      </div>
      
      {!isConfigured ? (
        <div className="p-4 border rounded-md mb-4">
          <h3 className="font-medium mb-2">Configure API Key</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Enter your Perplexity API key to use the AI assistant.
          </p>
          <div className="flex gap-2">
            <Input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Perplexity API Key"
              className="flex-1"
            />
            <Button 
              onClick={() => {
                if (apiKey.trim()) {
                  setIsConfigured(true);
                  toast({
                    title: "API Key Saved",
                    description: "Your API key has been temporarily saved for this session.",
                  });
                }
              }}
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Your API key is only stored in browser memory and will be cleared when you close the page.
          </p>
        </div>
      ) : null}
      
      <form onSubmit={handleQuerySubmit} className="flex items-center gap-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question or search for information..."
          disabled={isLoading || !isConfigured}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !isConfigured}>
          {isLoading ? "Loading..." : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Researching...</div>
          </div>
        ) : response ? (
          <div className="p-4 bg-secondary/30 rounded-md">
            <Textarea
              value={response}
              readOnly
              className="w-full h-full min-h-[200px] bg-transparent border-none resize-none focus-visible:ring-0"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Ask a question to get started
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
