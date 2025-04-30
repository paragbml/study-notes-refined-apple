
import { NotesProvider } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import NotesList from "@/components/NotesList";
import NoteEditor from "@/components/NoteEditor";

const Index = () => {
  return (
    <NotesProvider>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-56 md:min-w-56">
          <Sidebar />
        </div>
        <div className="w-full md:w-72 md:min-w-72 h-screen">
          <NotesList />
        </div>
        <div className="flex-1 h-screen">
          <NoteEditor />
        </div>
      </div>
    </NotesProvider>
  );
};

export default Index;
