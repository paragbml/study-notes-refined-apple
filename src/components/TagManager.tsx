
import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TagSelectProps = {
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
};

export const TagSelect = ({ selectedTags, onToggleTag }: TagSelectProps) => {
  const { tags } = useNotes();
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#4ECDC4");
  const { addTag } = useNotes();

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName, newTagColor);
      setNewTagName("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
          style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : "transparent", borderColor: tag.color }}
          className="cursor-pointer"
          onClick={() => onToggleTag(tag.id)}
        >
          {tag.name}
        </Badge>
      ))}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-6">
            <Plus className="h-3 w-3 mr-1" /> Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Add New Tag</h4>
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
                className="text-sm h-8"
              />
              <input 
                type="color" 
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-8 h-8 p-0 border rounded"
              />
              <Button size="sm" className="h-8" onClick={handleAddTag}>Add</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelect;
