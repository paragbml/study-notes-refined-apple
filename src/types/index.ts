
export type NoteCategory = {
  id: string;
  name: string;
};

export type NoteTag = {
  id: string;
  name: string;
  color: string;
};

export type NoteItem = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tags?: string[]; // Array of tag IDs
  createdAt: Date;
  updatedAt: Date;
  type: "text" | "checklist" | "mindmap";
  resources?: {
    links?: { title: string; url: string }[];
    images?: { id: string; src: string; alt: string }[];
  };
  checklist?: { id: string; text: string; checked: boolean }[];
  mindmap?: { nodes: MindMapNode[]; edges: MindMapEdge[] };
  cloudSynced?: boolean; // To track sync status
};

export type MindMapNode = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export type MindMapEdge = {
  id: string;
  source: string;
  target: string;
};
