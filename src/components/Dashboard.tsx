import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Header } from "./Header";
import { ChatHistory } from "./ChatHistory";
import { ChatInterface } from "./ChatInterface";
import { Card } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export const Dashboard = ({ user, onSignOut }: DashboardProps) => {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleNewChat = () => {
    setSelectedChatId(undefined);
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <Header userEmail={user.email} onSignOut={onSignOut} />
        <div className="flex-1 overflow-hidden">
          {selectedChatId ? (
            <ChatInterface 
              chatId={selectedChatId} 
              onNewChat={handleNewChat}
            />
          ) : (
            <Card className="h-full rounded-none border-0">
              <ChatHistory 
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                selectedChatId={selectedChatId}
              />
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header userEmail={user.email} onSignOut={onSignOut} />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <Card className="h-full rounded-none border-r border-t-0 border-l-0 border-b-0">
              <ChatHistory 
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                selectedChatId={selectedChatId}
              />
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="h-full">
              <ChatInterface 
                chatId={selectedChatId} 
                onNewChat={handleNewChat}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};