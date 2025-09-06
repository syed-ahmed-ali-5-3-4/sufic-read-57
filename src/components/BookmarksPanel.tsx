import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark, Edit, Trash2, Clock } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/hooks/use-toast';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChapter: (chapterId: number) => void;
}

export const BookmarksPanel = ({ isOpen, onClose, onNavigateToChapter }: BookmarksPanelProps) => {
  const { bookmarks, removeBookmark, updateBookmark } = useBookmarks();
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const { toast } = useToast();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditNote = (bookmarkId: string, currentNote?: string) => {
    setEditingBookmark(bookmarkId);
    setEditNote(currentNote || '');
  };

  const handleSaveNote = () => {
    if (editingBookmark) {
      updateBookmark(editingBookmark, { note: editNote });
      setEditingBookmark(null);
      setEditNote('');
      toast({
        title: "Note Updated",
        description: "Your bookmark note has been saved.",
      });
    }
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
    toast({
      title: "Bookmark Removed",
      description: "The bookmark has been deleted.",
    });
  };

  const handleNavigate = (chapterId: number) => {
    onNavigateToChapter(chapterId);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-card-elevated border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-amiri gradient-text">
              <Bookmark className="h-5 w-5" />
              Your Bookmarks
              <Badge variant="secondary" className="ml-auto">
                {bookmarks.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No bookmarks yet. Add some while reading!</p>
                </div>
              ) : (
                bookmarks
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((bookmark) => (
                    <Card
                      key={bookmark.id}
                      className="p-4 bg-gradient-card border-border hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => handleNavigate(bookmark.chapterId)}>
                          <h4 className="font-semibold text-foreground mb-1">
                            {bookmark.chapterTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(bookmark.timestamp)}</span>
                            {bookmark.position > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(bookmark.position)}% read
                              </Badge>
                            )}
                          </div>
                          {bookmark.note && (
                            <p className="text-sm text-foreground/80 bg-background-medium p-2 rounded mt-2">
                              {bookmark.note}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditNote(bookmark.id, bookmark.note)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBookmark(bookmark.id)}
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
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingBookmark} onOpenChange={() => setEditingBookmark(null)}>
        <DialogContent className="bg-card-elevated border-border">
          <DialogHeader>
            <DialogTitle className="font-amiri gradient-text">Edit Bookmark Note</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Add a note to this bookmark..."
              className="bg-background-medium border-border min-h-[100px]"
            />
            
            <div className="flex gap-2">
              <Button variant="islamic" onClick={handleSaveNote}>
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setEditingBookmark(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};