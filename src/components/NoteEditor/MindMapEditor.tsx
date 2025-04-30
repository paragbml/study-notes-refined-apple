
import { useRef, useEffect, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MindMapNode, MindMapEdge } from "@/types";

const MindMapEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newNodeText, setNewNodeText] = useState("");

  useEffect(() => {
    // If component mounts and there's no mindmap data, initialize it
    if (note && note.type === "mindmap" && !note.mindmap) {
      const initialNode: MindMapNode = { id: `n${Date.now()}`, text: note.title || "Main Topic", x: 300, y: 100 };
      updateNote(note.id, {
        mindmap: {
          nodes: [initialNode],
          edges: []
        }
      });
    }
  }, [note?.id]);

  if (!note || !note.mindmap) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(note.id, { title: e.target.value });
  };

  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    const node = note.mindmap?.nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({ x: offsetX - node.x, y: offsetY - node.y });
      setDraggedNodeId(nodeId);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      const updatedNodes = note.mindmap?.nodes.map(node => 
        node.id === draggedNodeId ? { ...node, x: newX, y: newY } : node
      );
      
      updateNote(note.id, { 
        mindmap: { 
          ...note.mindmap, 
          nodes: updatedNodes 
        } 
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleAddNode = () => {
    if (!newNodeText.trim() || !note.mindmap) return;

    const newNodeId = `n${Date.now()}`;
    const mainNode = note.mindmap.nodes[0] || { x: 300, y: 100 };
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 50;
    
    const newNode: MindMapNode = {
      id: newNodeId,
      text: newNodeText,
      x: mainNode.x + distance * Math.cos(angle),
      y: mainNode.y + distance * Math.sin(angle)
    };
    
    const newEdge: MindMapEdge = {
      id: `e${Date.now()}`,
      source: mainNode.id,
      target: newNodeId
    };
    
    updateNote(note.id, {
      mindmap: {
        nodes: [...note.mindmap.nodes, newNode],
        edges: [...note.mindmap.edges, newEdge]
      }
    });
    
    setNewNodeText("");
  };

  return (
    <div className="h-full flex flex-col p-4">
      <Input
        value={note.title}
        onChange={handleTitleChange}
        className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 px-0 mb-4"
        placeholder="Mind Map Title"
      />
      
      <div 
        ref={canvasRef} 
        className="flex-1 overflow-auto relative bg-secondary/50 rounded-md"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Draw edges */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {note.mindmap?.edges.map((edge) => {
            const sourceNode = note.mindmap?.nodes.find(n => n.id === edge.source);
            const targetNode = note.mindmap?.nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            return (
              <line
                key={edge.id}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#aaa"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        {/* Draw nodes */}
        {note.mindmap?.nodes.map((node) => (
          <div
            key={node.id}
            className="mind-map-node absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`
            }}
            onMouseDown={(e) => handleNodeDragStart(node.id, e)}
          >
            {node.text}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <Input
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          placeholder="Add new node..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddNode();
            }
          }}
        />
        <Button onClick={handleAddNode}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default MindMapEditor;
