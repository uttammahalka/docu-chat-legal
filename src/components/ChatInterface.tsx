import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Send, Paperclip, User, Bot } from "lucide-react";
import { fetchChatGPTReply } from '../chatgpt';


interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface ChatInterfaceProps {
  chatId?: string;
  onNewChat: () => void;
}

export const ChatInterface = ({ chatId, onNewChat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: selectedFile ? `${input} [Document: ${selectedFile.name}]` : input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null);
    setIsLoading(true);

    // Simulate AI response - replace with actual API call
    try {
  const reply = await fetchChatGPTReply([
  { role: "user", content: userMessage.content }
]);
  const aiResponse: Message = {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content: reply.content || "I'm sorry, I couldn't generate a response.",
    timestamp: new Date(),
    sources: reply.sources || []
  };
  setMessages(prev => [...prev, aiResponse]);
} catch (error) {
  console.error("Error fetching AI response:", error);
  toast({
    title: "Error",
    description: "Failed to get response from AI.",
    variant: "destructive",
  });
} finally {
  setIsLoading(false);
}
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("text/")) {
        setSelectedFile(file);
        toast({
          title: "File selected",
          description: `${file.name} is ready to upload`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF or text file",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)]">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <Card className="bg-accent/50">
                <CardContent className="p-6 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to Legal AI Assistant</h3>
                  <p className="text-muted-foreground">
                    Ask me legal questions, upload documents for analysis, or get guidance on legal matters.
                    I can help with contract review, legal research, and provide citations to relevant laws.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {message.role === "user" ? (
                        <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.sources && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium">Legal Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.1s"}} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="border-t p-4 bg-background">
        {selectedFile && (
          <div className="mb-3 p-2 bg-accent rounded-md flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              Remove
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a legal question or describe your document..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
