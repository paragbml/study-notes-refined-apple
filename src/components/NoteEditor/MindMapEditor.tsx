
import { useRef, useEffect, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Move,
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  Edit,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MindMapNode, MindMapEdge } from "@/types";

const MindMapEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newNodeText, setNewNodeText] = useState("");
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Initialize mindmap if it doesn't exist
    if (note && !note.mindmap) {
      const initialNode: MindMapNode = { 
        id: `n${Date.now()}`, 
        text: note.title || "Main Topic", 
        x: 300, 
        y: 100 
      };
      
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
    if (note.mindmap?.nodes && note.mindmap.nodes.length > 0) {
      // Update the main node text when title changes
      const mainNode = note.mindmap.nodes[0];
      const updatedNodes = note.mindmap.nodes.map(node => 
        node.id === mainNode.id ? { ...node, text: e.target.value } : node
      );
      
      updateNote(note.id, { 
        title: e.target.value,
        mindmap: { 
          ...note.mindmap, 
          nodes: updatedNodes 
        } 
      });
    } else {
      updateNote(note.id, { title: e.target.value });
    }
  };

  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    const node = note.mindmap?.nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({ 
        x: offsetX - (node.x * zoom + panOffset.x), 
        y: offsetY - (node.y * zoom + panOffset.y) 
      });
      setDraggedNodeId(nodeId);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if (draggedNodeId) {
      // Moving a node
      const newX = (e.clientX - rect.left - dragOffset.x - panOffset.x) / zoom;
      const newY = (e.clientY - rect.top - dragOffset.y - panOffset.y) / zoom;
      
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
    else if (isPanning) {
      // Panning the canvas
      const newPanX = e.clientX - rect.left - startPan.x;
      const newPanY = e.clientY - rect.top - startPan.y;
      setPanOffset({ x: newPanX, y: newPanY });
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };
  
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only initiate panning with middle mouse button or when holding space
    if (e.button === 1 || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setIsPanning(true);
      
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setStartPan({
          x: e.clientX - rect.left - panOffset.x,
          y: e.clientY - rect.top - panOffset.y
        });
      }
    }
  };
  
  const handleAddNode = () => {
    if (!newNodeText.trim() || !note.mindmap) return;

    const newNodeId = `n${Date.now()}`;
    // Make sure we cast this to MindMapNode
    const mainNode = note.mindmap.nodes[0] || { id: newNodeId, text: "Main Topic", x: 300, y: 100 };
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
  
  const handleDeleteNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't delete the main node
    if (note.mindmap?.nodes[0].id === nodeId) return;
    
    const updatedNodes = note.mindmap?.nodes.filter(node => node.id !== nodeId);
    const updatedEdges = note.mindmap?.edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    
    updateNote(note.id, {
      mindmap: {
        nodes: updatedNodes,
        edges: updatedEdges
      }
    });
  };
  
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingNode) return;
    
    const node = note.mindmap?.nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setEditText(node.text);
    }
  };
  
  const handleEditSave = () => {
    if (!editingNode || !editText.trim()) return;
    
    const updatedNodes = note.mindmap?.nodes.map(node => 
      node.id === editingNode ? { ...node, text: editText } : node
    );
    
    updateNote(note.id, {
      mindmap: {
        ...note.mindmap,
        nodes: updatedNodes
      }
    });
    
    setEditingNode(null);
    setEditText("");
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };
  
  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Mind Map Editor Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            placeholder="Add new node..."
            className="w-56"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddNode();
              }
            }}
          />
          <Button onClick={handleAddNode} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleResetView}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-xs px-2">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center mb-1 text-xs text-muted-foreground">
        <Move className="h-3 w-3 mr-1" />
        <span>Ctrl/Cmd+drag to pan | Click node to edit | Drag nodes to move</span>
      </div>
      
      <div 
        ref={canvasRef} 
        className="flex-1 overflow-hidden relative bg-secondary/20 rounded-md cursor-move border"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Draw edges */}
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none" 
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
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
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Draw nodes */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {note.mindmap?.nodes.map((node) => (
            <div
              key={node.id}
              className={`mind-map-node absolute transform -translate-x-1/2 -translate-y-1/2 
                ${node.id === note.mindmap?.nodes[0].id ? 
                  'bg-primary/10 border-primary/30' : 
                  'bg-white border-gray-200'
                } 
                p-2 rounded-md shadow-md group
                ${draggedNodeId === node.id ? 'z-10 ring-2 ring-primary' : ''}
                ${editingNode === node.id ? 'z-20' : ''}
              `}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                minWidth: '100px',
                maxWidth: '200px'
              }}
              onClick={(e) => handleNodeClick(node.id, e)}
              onMouseDown={(e) => handleNodeDragStart(node.id, e)}
            >
              {editingNode === node.id ? (
                <div className="flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                    className="w-full p-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditSave();
                      } else if (e.key === "Escape") {
                        setEditingNode(null);
                        setEditText("");
                      }
                    }}
                  />
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => {
                        setEditingNode(null);
                        setEditText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={handleEditSave}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm break-words">{node.text}</div>
                  
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex gap-1 p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-1 bg-white/80 hover:bg-white"
                      onClick={(e) => handleNodeClick(node.id, e)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    {/* Don't show delete button for main node */}
                    {node.id !== note.mindmap?.nodes[0].id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-1 bg-white/80 hover:bg-white text-destructive hover:text-destructive"
                        onClick={(e) => handleDeleteNode(node.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindMapEditor;
