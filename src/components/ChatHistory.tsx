import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageCircle, Calendar, User } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
  messageCount: number;
  topics: string[];
}

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  selectedChatId?: string;
}

export const ChatHistory = ({ onSelectChat, onNewChat, selectedChatId }: ChatHistoryProps) => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Contract Review Assistance",
      preview: "Help me understand this employment contract clause...",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      messageCount: 8,
      topics: ["Employment Law", "Contracts"]
    },
    {
      id: "2", 
      title: "Tenant Rights Question",
      preview: "What are my rights as a tenant when landlord...",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      messageCount: 12,
      topics: ["Property Law", "Tenant Rights"]
    },
    {
      id: "3",
      title: "Small Business Formation",
      preview: "I'm starting a small business and need to know...",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      messageCount: 15,
      topics: ["Business Law", "Corporate Formation"]
    }
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Chat History</CardTitle>
          <Button onClick={onNewChat} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </CardHeader>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 py-4">
          {chats.map((chat) => (
            <Card 
              key={chat.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedChatId === chat.id ? "bg-accent border-primary" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm line-clamp-1">{chat.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(chat.createdAt)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {chat.preview}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {chat.topics.slice(0, 2).map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                          {topic}
                        </Badge>
                      ))}
                      {chat.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          +{chat.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      {chat.messageCount}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {chats.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-sm font-medium mb-2">No conversations yet</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Start a new chat to begin your legal research
              </p>
              <Button onClick={onNewChat} size="sm">
                Start First Chat
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};