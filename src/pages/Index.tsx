
import { NotesProvider } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import NotesList from "@/components/NotesList";
import NoteEditor from "@/components/NoteEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAssistant from "@/components/AIAssistant";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("notes");

  return (
    <NotesProvider>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-56 md:min-w-56">
          <Sidebar />
        </div>
        <div className="w-full md:w-72 md:min-w-72 h-screen">
          <NotesList />
        </div>
        <div className="flex-1 h-screen">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex justify-end p-2 border-b border-border">
              <TabsList>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="notes" className="h-full">
                <NoteEditor />
              </TabsContent>
              
              <TabsContent value="ai" className="h-full">
                <AIAssistant />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </NotesProvider>
  );
};

export default Index;
