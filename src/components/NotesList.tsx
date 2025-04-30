
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotesList = () => {
  const {
    getNotesByCategory,
    activeCategoryId,
    activeNoteId,
    setActiveNoteId,
    addNote,
    deleteNote
  } = useNotes();

  const notes = getNotesByCategory(activeCategoryId);

  const handleAddNote = () => {
    addNote({
      title: "New Note",
      content: "",
      categoryId: activeCategoryId === "all" ? "cat1" : activeCategoryId,
      type: "text"
    });
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(id);
    }
  };

  return (
    <div className="h-full flex flex-col border-r border-border">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h2 className="font-medium">Notes</h2>
        <Button size="sm" variant="ghost" onClick={handleAddNote}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No notes found
          </div>
        ) : (
          <ul>
            {notes.map((note) => (
              <li
                key={note.id}
                className={`note-item ${note.id === activeNoteId ? "note-item-active" : ""}`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {note.type === "checklist"
                        ? `${note.checklist?.filter((item) => item.checked).length || 0} of ${
                            note.checklist?.length || 0
                          } items completed`
                        : note.type === "mindmap"
                        ? "Mind Map"
                        : note.content.substring(0, 60)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => handleDeleteNote(note.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotesList;
