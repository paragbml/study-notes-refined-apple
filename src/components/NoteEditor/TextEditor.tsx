
import { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TextEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();
  
  if (!note) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(note.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <Input
        value={note.title}
        onChange={handleTitleChange}
        className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 px-0 mb-4"
        placeholder="Note Title"
      />
      <Textarea
        value={note.content}
        onChange={handleContentChange}
        className="flex-1 resize-none border-none bg-transparent focus-visible:ring-0 px-0 font-light"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default TextEditor;
