import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Languages } from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  content: string;
  language: 'english' | 'urdu';
}

interface SearchResult {
  chapter: Chapter;
  chapterIndex: number;
  matches: {
    type: 'title' | 'content';
    text: string;
    highlightedText: string;
  }[];
}

interface SearchDialogProps {
  chapters: Chapter[];
  isOpen: boolean;
  onClose: () => void;
  onChapterSelect: (chapterIndex: number) => void;
  language: 'english' | 'urdu';
}

export const SearchDialog = ({ 
  chapters, 
  isOpen, 
  onClose, 
  onChapterSelect, 
  language 
}: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const filteredChapters = chapters.filter(ch => ch.language === language);
    const results: SearchResult[] = [];

    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    filteredChapters.forEach((chapter, index) => {
      const matches: SearchResult['matches'] = [];

      // Search in title (more flexible matching)
      const titleLower = chapter.title.toLowerCase();
      if (titleLower.includes(query)) {
        const highlightedTitle = chapter.title.replace(
          new RegExp(`(${escapedQuery})`, 'gi'),
          '<mark class="bg-primary/20 text-primary rounded px-1">$1</mark>'
        );
        matches.push({
          type: 'title',
          text: chapter.title,
          highlightedText: highlightedTitle
        });
      }

      // Enhanced content search - search by words and phrases
      const contentWords = query.split(/\s+/).filter(word => word.length > 2);
      const contentLower = chapter.content.toLowerCase();
      
      // Direct phrase search
      if (contentLower.includes(query)) {
        const sentences = chapter.content.split(/[.!?]\s+/);
        const matchingSentences = sentences.filter(sentence => 
          sentence.toLowerCase().includes(query)
        );
        
        matchingSentences.slice(0, 3).forEach(sentence => {
          const highlightedContent = sentence.replace(
            new RegExp(`(${escapedQuery})`, 'gi'),
            '<mark class="bg-primary/20 text-primary rounded px-1">$1</mark>'
          );
          matches.push({
            type: 'content',
            text: sentence.trim(),
            highlightedText: highlightedContent
          });
        });
      }
      
      // Word-based search for better results
      if (contentWords.length > 0 && matches.filter(m => m.type === 'content').length === 0) {
        const paragraphs = chapter.content.split('\n\n');
        const matchingParagraphs = paragraphs.filter(paragraph => {
          const paragraphLower = paragraph.toLowerCase();
          return contentWords.some(word => paragraphLower.includes(word));
        });

        matchingParagraphs.slice(0, 2).forEach(paragraph => {
          let highlightedContent = paragraph;
          contentWords.forEach(word => {
            if (word.length > 2) {
              const wordRegex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
              highlightedContent = highlightedContent.replace(
                wordRegex,
                '<mark class="bg-primary/20 text-primary rounded px-1">$1</mark>'
              );
            }
          });
          
          matches.push({
            type: 'content',
            text: paragraph,
            highlightedText: highlightedContent
          });
        });
      }

      if (matches.length > 0) {
        results.push({
          chapter,
          chapterIndex: index,
          matches
        });
      }
    });

    // Sort results by relevance (title matches first, then by number of matches)
    return results.sort((a, b) => {
      const aTitleMatch = a.matches.some(m => m.type === 'title');
      const bTitleMatch = b.matches.some(m => m.type === 'title');
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return b.matches.length - a.matches.length;
    });
  }, [searchQuery, chapters, language]);

  const handleResultClick = (chapterIndex: number) => {
    onChapterSelect(chapterIndex);
    onClose();
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card-elevated border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-amiri gradient-text">
            <Search className="h-5 w-5" />
            Search Chapters
            <Badge variant="secondary" className="ml-auto">
              {language === 'english' ? 'English' : 'اردو'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search chapters and content...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background-medium border-border"
              autoFocus
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start typing to search chapters and content...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                searchResults.map((result) => (
                  <Card
                    key={result.chapter.id}
                    className="p-4 cursor-pointer bg-gradient-card border-border hover:bg-primary/5 transition-colors"
                    onClick={() => handleResultClick(result.chapterIndex)}
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="shrink-0 mt-1">
                        {result.chapterIndex + 1}
                      </Badge>
                      <div className="flex-1">
                        <h4 className={`
                          font-semibold mb-2 
                          ${language === 'urdu' ? 'text-right font-amiri' : ''}
                        `}>
                          <span 
                            dangerouslySetInnerHTML={{ 
                              __html: result.matches.find(m => m.type === 'title')?.highlightedText || result.chapter.title 
                            }} 
                          />
                        </h4>
                        
                        <div className="space-y-2">
                          {result.matches.filter(m => m.type === 'content').slice(0, 2).map((match, idx) => (
                            <p 
                              key={idx}
                              className={`
                                text-sm text-muted-foreground leading-relaxed
                                ${language === 'urdu' ? 'text-right' : ''}
                              `}
                            >
                              <span 
                                dangerouslySetInnerHTML={{ 
                                  __html: match.highlightedText.substring(0, 150) + '...' 
                                }} 
                              />
                            </p>
                          ))}
                        </div>
                        
                        {result.matches.length > 3 && (
                          <p className="text-xs text-primary mt-2">
                            +{result.matches.length - 3} more matches
                          </p>
                        )}
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
  );
};