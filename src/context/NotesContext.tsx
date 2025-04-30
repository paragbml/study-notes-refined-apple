
import React, { createContext, useContext, useState, useEffect } from "react";
import { NoteItem, NoteCategory } from "@/types";

type NotesContextType = {
  notes: NoteItem[];
  categories: NoteCategory[];
  activeNoteId: string | null;
  activeCategoryId: string;
  setActiveNoteId: (id: string | null) => void;
  setActiveCategoryId: (id: string) => void;
  addNote: (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, note: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  addCategory: (name: string) => void;
  getActiveNote: () => NoteItem | undefined;
  getNotesByCategory: (categoryId: string) => NoteItem[];
};

// Sample data
const initialCategories: NoteCategory[] = [
  { id: "all", name: "All Notes" },
  { id: "cat1", name: "Study" },
  { id: "cat2", name: "Projects" },
  { id: "cat3", name: "Research" }
];

const initialNotes: NoteItem[] = [
  {
    id: "note1",
    title: "Introduction to React",
    content: "React is a JavaScript library for building user interfaces.",
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "text"
  },
  {
    id: "note2",
    title: "Biology Exam Prep",
    content: "",
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "checklist",
    checklist: [
      { id: "cl1", text: "Study cell structure", checked: true },
      { id: "cl2", text: "Review photosynthesis", checked: false },
      { id: "cl3", text: "Practice diagrams", checked: false }
    ]
  },
  {
    id: "note3",
    title: "Research Paper Ideas",
    content: "Potential topics for the semester research paper.",
    categoryId: "cat3",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "mindmap",
    mindmap: {
      nodes: [
        { id: "n1", text: "Research Topics", x: 300, y: 100 },
        { id: "n2", text: "AI Ethics", x: 150, y: 200 },
        { id: "n3", text: "Climate Tech", x: 300, y: 200 },
        { id: "n4", text: "Blockchain", x: 450, y: 200 }
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n1", target: "n3" },
        { id: "e3", source: "n1", target: "n4" }
      ]
    }
  }
];

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [categories, setCategories] = useState<NoteCategory[]>(initialCategories);
  const [activeNoteId, setActiveNoteId] = useState<string | null>("note1");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const addNote = (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => {
    const newNote: NoteItem = {
      ...note,
      id: `note${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes((prev) => [...prev, newNote]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, note: Partial<NoteItem>) => {
    setNotes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...note, updatedAt: new Date() } : item
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const addCategory = (name: string) => {
    const newCategory = {
      id: `cat${Date.now()}`,
      name
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNoteId);
  };

  const getNotesByCategory = (categoryId: string) => {
    if (categoryId === "all") {
      return notes;
    }
    return notes.filter((note) => note.categoryId === categoryId);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        categories,
        activeNoteId,
        activeCategoryId,
        setActiveNoteId,
        setActiveCategoryId,
        addNote,
        updateNote,
        deleteNote,
        addCategory,
        getActiveNote,
        getNotesByCategory
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
