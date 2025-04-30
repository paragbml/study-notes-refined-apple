
import { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Link, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TagSelect from "../TagManager";

const UnifiedEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();
  
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  
  if (!note) return null;
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(note.id, { title: e.target.value });
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };
  
  // Checklist methods
  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem = {
      id: `cl${Date.now()}`,
      text: newChecklistItem,
      checked: false
    };
    
    updateNote(note.id, {
      checklist: [...(note.checklist || []), newItem]
    });
    
    setNewChecklistItem("");
  };
  
  const handleCheckChange = (id: string, checked: boolean) => {
    const updatedChecklist = note.checklist?.map((item) =>
      item.id === id ? { ...item, checked } : item
    );
    updateNote(note.id, { checklist: updatedChecklist });
  };
  
  const handleChecklistItemTextChange = (id: string, text: string) => {
    const updatedChecklist = note.checklist?.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    updateNote(note.id, { checklist: updatedChecklist });
  };
  
  const handleDeleteChecklistItem = (id: string) => {
    const updatedChecklist = note.checklist?.filter((item) => item.id !== id);
    updateNote(note.id, { checklist: updatedChecklist });
  };
  
  // Resources methods
  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    
    const newLink = { title: linkTitle, url: linkUrl };
    updateNote(note.id, {
      resources: {
        ...note.resources,
        links: [...(note.resources?.links || []), newLink]
      }
    });
    
    setLinkTitle("");
    setLinkUrl("");
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    
    const newImage = { id: `img${Date.now()}`, src: imageUrl, alt: imageAlt || "Image" };
    updateNote(note.id, {
      resources: {
        ...note.resources,
        images: [...(note.resources?.images || []), newImage]
      }
    });
    
    setImageUrl("");
    setImageAlt("");
  };

  const handleDeleteLink = (index: number) => {
    const updatedLinks = note.resources?.links?.filter((_, i) => i !== index);
    updateNote(note.id, {
      resources: {
        ...note.resources,
        links: updatedLinks
      }
    });
  };

  const handleDeleteImage = (id: string) => {
    const updatedImages = note.resources?.images?.filter(img => img.id !== id);
    updateNote(note.id, {
      resources: {
        ...note.resources,
        images: updatedImages
      }
    });
  };
  
  // Tags management
  const handleToggleTag = (tagId: string) => {
    const currentTags = note.tags || [];
    const updatedTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    updateNote(note.id, { tags: updatedTags });
  };
  
  return (
    <div className="h-full flex flex-col p-4">
      <Input
        value={note.title}
        onChange={handleTitleChange}
        className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 px-0 mb-2"
        placeholder="Note Title"
      />
      
      <div className="mb-4">
        <TagSelect 
          selectedTags={note.tags || []} 
          onToggleTag={handleToggleTag} 
        />
      </div>
      
      <div className="flex-1 overflow-auto">
        <Textarea
          value={note.content}
          onChange={handleContentChange}
          className="resize-none border-none bg-transparent focus-visible:ring-0 px-0 py-2 min-h-[100px] mb-4"
          placeholder="Start typing..."
        />
        
        {/* Checklist Section */}
        <div className="mb-6">
          <h3 className="font-medium text-sm mb-2">Checklist</h3>
          <ul className="space-y-2 mb-2">
            {note.checklist?.map((item) => (
              <li key={item.id} className="flex items-center gap-2 group">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                  className="h-5 w-5"
                />
                <Input
                  value={item.text}
                  onChange={(e) => handleChecklistItemTextChange(item.id, e.target.value)}
                  className={`border-none focus-visible:ring-0 px-0 py-0 ${
                    item.checked ? "line-through text-muted-foreground" : ""
                  }`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteChecklistItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Checkbox disabled className="h-5 w-5" />
            <Input
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Add new item..."
              className="border-none focus-visible:ring-0 px-0 py-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddChecklistItem();
                }
              }}
            />
            <Button variant="ghost" size="sm" onClick={handleAddChecklistItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Resources Section */}
        <div>
          <h3 className="font-medium text-sm mb-2">Resources</h3>
          <Tabs defaultValue="links" className="w-full">
            <TabsList className="mb-2 h-8">
              <TabsTrigger value="links" className="text-xs h-7">Links</TabsTrigger>
              <TabsTrigger value="images" className="text-xs h-7">Images</TabsTrigger>
            </TabsList>
            
            <TabsContent value="links">
              <div className="space-y-3">
                <div className="flex flex-col space-y-2">
                  {note.resources?.links && note.resources.links.length > 0 ? (
                    <ul className="space-y-2">
                      {note.resources.links.map((link, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            <Link className="h-3 w-3 mr-1" />
                            {link.title}
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDeleteLink(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">No links added</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Title"
                    className="text-xs h-8"
                  />
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="URL"
                    className="text-xs h-8"
                  />
                  <Button size="sm" className="h-8" onClick={handleAddLink}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="images">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {note.resources?.images && note.resources.images.length > 0 ? (
                    note.resources.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground col-span-2">No images added</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL"
                    className="text-xs h-8"
                  />
                  <Input
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Alt text"
                    className="text-xs h-8"
                  />
                  <Button size="sm" className="h-8" onClick={handleAddImage}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UnifiedEditor;
