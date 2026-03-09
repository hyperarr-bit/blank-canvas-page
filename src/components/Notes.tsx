import { useState } from "react";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Note {
  id: string;
  text: string;
}

interface NotesProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

export const Notes = ({ notes, setNotes }: NotesProps) => {
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now().toString(), text: newNote }]);
      setNewNote("");
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border animate-fade-in">
      <div className="table-header flex items-center justify-center gap-2">
        <StickyNote className="w-5 h-5" />
        ANOTAÇÕES
      </div>

      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <span className="text-primary mt-1">•</span>
            <span className="flex-1 text-sm">{note.text}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNote(note.id)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Nova anotação..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            className="bg-background"
          />
          <Button size="icon" onClick={addNote}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
