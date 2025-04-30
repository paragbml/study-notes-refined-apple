
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";

const Sidebar = () => {
  const { categories, activeCategoryId, setActiveCategoryId, addCategory } = useNotes();

  const handleAddCategory = () => {
    const name = prompt("Enter category name");
    if (name) {
      addCategory(name);
    }
  };

  return (
    <div className="h-full flex flex-col border-r border-border bg-secondary/50">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h1 className="font-semibold text-lg">Study Notes</h1>
        <Button size="sm" variant="ghost" onClick={handleAddCategory}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <Button
                variant={activeCategoryId === category.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-sm font-normal h-8 ${
                  activeCategoryId === category.id ? "bg-accent" : ""
                }`}
                onClick={() => setActiveCategoryId(category.id)}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
