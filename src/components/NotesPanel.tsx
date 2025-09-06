import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterId?: number;
  chapterTitle?: string;
}

export const NotesPanel = ({ isOpen, onClose, currentChapterId, chapterTitle }: NotesPanelProps) => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const { toast } = useToast();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = () => {
    if (noteContent.trim() && currentChapterId) {
      addNote(currentChapterId, noteContent);
      setNoteContent('');
      setIsAddingNote(false);
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully.",
      });
    }
  };

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNote(noteId);
    setNoteContent(content);
  };

  const handleUpdateNote = () => {
    if (editingNote && noteContent.trim()) {
      updateNote(editingNote, noteContent);
      setEditingNote(null);
      setNoteContent('');
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully.",
      });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast({
      title: "Note Deleted",
      description: "The note has been removed.",
    });
  };

  const allNotes = notes.sort((a, b) => b.timestamp - a.timestamp);
  const currentChapterNotes = currentChapterId ? notes.filter(note => note.chapterId === currentChapterId) : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-card-elevated border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-amiri gradient-text">
              <StickyNote className="h-5 w-5" />
              Your Notes
              <Badge variant="secondary" className="ml-auto">
                {allNotes.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add Note for Current Chapter */}
            {currentChapterId && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">
                    Current: {chapterTitle}
                  </h4>
                  <Button
                    variant="islamic"
                    size="sm"
                    onClick={() => setIsAddingNote(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Note
                  </Button>
                </div>
                
                {currentChapterNotes.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {currentChapterNotes.length} note(s) in this chapter
                  </div>
                )}
              </Card>
            )}

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {allNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notes yet. Start taking notes while reading!</p>
                  </div>
                ) : (
                  allNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="p-4 bg-gradient-card border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(note.timestamp)}</span>
                            <Badge variant="outline" className="text-xs">
                              Chapter {note.chapterId}
                            </Badge>
                          </div>
                          <p className="text-foreground whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditNote(note.id, note.content)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="bg-card-elevated border-border">
          <DialogHeader>
            <DialogTitle className="font-amiri gradient-text">Add New Note</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Adding note to: {chapterTitle}
            </p>
            
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className="bg-background-medium border-border min-h-[150px]"
              autoFocus
            />
            
            <div className="flex gap-2">
              <Button variant="islamic" onClick={handleAddNote}>
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="bg-card-elevated border-border">
          <DialogHeader>
            <DialogTitle className="font-amiri gradient-text">Edit Note</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Edit your note..."
              className="bg-background-medium border-border min-h-[150px]"
              autoFocus
            />
            
            <div className="flex gap-2">
              <Button variant="islamic" onClick={handleUpdateNote}>
                Update Note
              </Button>
              <Button variant="outline" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};