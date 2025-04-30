
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Link, CheckSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

  // Helpers to determine if a note has certain content
  const hasChecklist = (note) => note.checklist && note.checklist.length > 0;
  const hasResources = (note) => 
    (note.resources?.links && note.resources.links.length > 0) || 
    (note.resources?.images && note.resources.images.length > 0);
  const hasMindMap = (note) => note.mindmap && note.mindmap.nodes && note.mindmap.nodes.length > 0;

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
                className={`note-item ${note.id === activeNoteId ? "note-item-active" : ""} p-3 border-b border-border cursor-pointer hover:bg-muted/50 group`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {note.content.substring(0, 60)}
                    </p>
                    <div className="flex gap-1 mt-1 items-center">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </p>
                      <div className="flex gap-1">
                        {hasChecklist(note) && (
                          <Badge variant="outline" className="h-5 px-1 text-xs bg-muted/50">
                            <CheckSquare className="h-3 w-3 mr-1" />
                            {note.checklist.filter(item => item.checked).length}/{note.checklist.length}
                          </Badge>
                        )}
                        {hasResources(note) && (
                          <Badge variant="outline" className="h-5 px-1 text-xs bg-muted/50">
                            <Link className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
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
