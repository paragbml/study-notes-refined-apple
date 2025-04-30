
import { useEffect } from "react";
import { useNotes } from "@/context/NotesContext";
import UnifiedEditor from "./UnifiedEditor";

const NoteEditor = () => {
  const { getActiveNote, updateNote, syncStatus } = useNotes();
  const note = getActiveNote();

  // Auto-save when component unmounts or note changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Force sync before page unload
      if (note && syncStatus !== "synced") {
        updateNote(note.id, { cloudSynced: false });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Trigger save when component unmounts
      if (note) {
        updateNote(note.id, { cloudSynced: false });
      }
    };
  }, [note?.id, updateNote, syncStatus]);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a note or create a new one
      </div>
    );
  }

  // For all note types, we use the UnifiedEditor which has collapsible sections
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <UnifiedEditor />
      </div>
    </div>
  );
};

export default NoteEditor;
