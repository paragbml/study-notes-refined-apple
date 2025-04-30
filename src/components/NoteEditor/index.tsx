
import { useNotes } from "@/context/NotesContext";
import TextEditor from "./TextEditor";
import ChecklistEditor from "./ChecklistEditor";
import MindMapEditor from "./MindMapEditor";
import ResourcesEditor from "./ResourcesEditor";
import UnifiedEditor from "./UnifiedEditor";

const NoteEditor = () => {
  const { getActiveNote } = useNotes();
  const note = getActiveNote();

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a note or create a new one
      </div>
    );
  }

  // For all note types, we now use the UnifiedEditor which has collapsible sections
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <UnifiedEditor />
      </div>
    </div>
  );
};

export default NoteEditor;
