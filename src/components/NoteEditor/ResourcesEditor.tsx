
import { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link, Image, Trash2 } from "lucide-react";

const ResourcesEditor = () => {
  const { getActiveNote, updateNote } = useNotes();
  const note = getActiveNote();
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  if (!note) return null;

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

  return (
    <div className="p-4 border-t border-border">
      <h3 className="font-medium text-sm mb-2">Resources</h3>
      
      <Tabs defaultValue="links">
        <TabsList className="mb-4">
          <TabsTrigger value="links" className="text-xs">Links</TabsTrigger>
          <TabsTrigger value="images" className="text-xs">Images</TabsTrigger>
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
  );
};

export default ResourcesEditor;
