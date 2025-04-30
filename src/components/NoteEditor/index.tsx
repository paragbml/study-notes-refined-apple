
import { useNotes } from "@/context/NotesContext";
import TextEditor from "./TextEditor";
import ChecklistEditor from "./ChecklistEditor";
import MindMapEditor from "./MindMapEditor";
import ResourcesEditor from "./ResourcesEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BookOpen, Map } from "lucide-react";

const NoteEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a note or create a new one
      </div>
    );
  }

  const handleChangeType = (type: "text" | "checklist" | "mindmap") => {
    let updatedNote: any = { type };

    // Initialize proper data structure based on type
    if (type === "checklist" && !note.checklist) {
      updatedNote.checklist = [];
    } else if (type === "mindmap" && !note.mindmap) {
      updatedNote.mindmap = {
        nodes: [{ id: `n${Date.now()}`, text: note.title || "Main Topic", x: 300, y: 100 }],
        edges: []
      };
    }

    updateNote(note.id, updatedNote);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end p-2 border-b border-border">
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={note.type === "text" ? "secondary" : "ghost"}
            className="h-7 py-1 px-2"
            onClick={() => handleChangeType("text")}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={note.type === "checklist" ? "secondary" : "ghost"}
            className="h-7 py-1 px-2"
            onClick={() => handleChangeType("checklist")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={note.type === "mindmap" ? "secondary" : "ghost"}
            className="h-7 py-1 px-2"
            onClick={() => handleChangeType("mindmap")}
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {note.type === "text" && <TextEditor />}
        {note.type === "checklist" && <ChecklistEditor />}
        {note.type === "mindmap" && <MindMapEditor />}
      </div>

      <ResourcesEditor />
    </div>
  );
};

export default NoteEditor;
