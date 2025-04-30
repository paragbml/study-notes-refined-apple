
import { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

const ChecklistEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();
  const [newItem, setNewItem] = useState("");

  if (!note || !note.checklist) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(note.id, { title: e.target.value });
  };

  const handleCheckChange = (id: string, checked: boolean) => {
    const updatedChecklist = note.checklist?.map((item) =>
      item.id === id ? { ...item, checked } : item
    );
    updateNote(note.id, { checklist: updatedChecklist });
  };

  const handleTextChange = (id: string, text: string) => {
    const updatedChecklist = note.checklist?.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    updateNote(note.id, { checklist: updatedChecklist });
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    const newChecklistItem = {
      id: `cl${Date.now()}`,
      text: newItem,
      checked: false
    };
    
    updateNote(note.id, {
      checklist: [...(note.checklist || []), newChecklistItem]
    });
    
    setNewItem("");
  };

  const handleDeleteItem = (id: string) => {
    const updatedChecklist = note.checklist?.filter((item) => item.id !== id);
    updateNote(note.id, { checklist: updatedChecklist });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <Input
        value={note.title}
        onChange={handleTitleChange}
        className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 px-0 mb-4"
        placeholder="Checklist Title"
      />
      
      <div className="flex-1 overflow-auto">
        <ul className="space-y-2">
          {note.checklist?.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <Checkbox
                checked={item.checked}
                onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                className="h-5 w-5"
              />
              <Input
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                className={`border-none focus-visible:ring-0 px-0 py-0 ${
                  item.checked ? "line-through text-muted-foreground" : ""
                }`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <Checkbox disabled className="h-5 w-5" />
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
          className="border-none focus-visible:ring-0 px-0 py-0"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddItem();
            }
          }}
        />
        <Button variant="ghost" size="sm" onClick={handleAddItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChecklistEditor;
