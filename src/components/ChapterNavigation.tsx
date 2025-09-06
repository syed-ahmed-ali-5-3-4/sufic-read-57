import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Languages,
  Menu,
  X
} from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  content: string;
  language: 'english' | 'urdu';
}

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterChange: (index: number) => void;
  language: 'english' | 'urdu';
}

export const ChapterNavigation = ({ 
  chapters, 
  currentChapter, 
  onChapterChange, 
  language 
}: ChapterNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredChapters = chapters.filter(chapter => chapter.language === language);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-card-elevated border-border"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Chapter Navigation Panel */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen w-80 bg-card-elevated border-r border-border z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-amiri gradient-text font-bold">
              Chapters
            </h3>
            <Badge variant="secondary" className="ml-auto">
              {language === 'english' ? 'English' : 'اردو'}
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-2">
            {filteredChapters.map((chapter, index) => (
              <Card
                key={chapter.id}
                className={`
                  p-4 cursor-pointer transition-all duration-300 border
                  ${currentChapter === index 
                    ? 'bg-primary/10 border-primary shadow-lg' 
                    : 'bg-gradient-card border-border hover:bg-primary/5'
                  }
                `}
                onClick={() => {
                  onChapterChange(index);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <Badge 
                    variant={currentChapter === index ? "default" : "secondary"}
                    className="shrink-0 mt-1"
                  >
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className={`
                      text-sm font-semibold mb-1 
                      ${language === 'urdu' ? 'text-right font-amiri' : ''}
                      ${currentChapter === index ? 'text-primary' : 'text-foreground'}
                    `}>
                      {chapter.title}
                    </h4>
                    <p className={`
                      text-xs text-muted-foreground line-clamp-2
                      ${language === 'urdu' ? 'text-right' : ''}
                    `}>
                      {chapter.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Navigation Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card-elevated border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChapterChange(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChapterChange(Math.min(filteredChapters.length - 1, currentChapter + 1))}
              disabled={currentChapter === filteredChapters.length - 1}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="text-center mt-2">
            <span className="text-xs text-muted-foreground">
              {currentChapter + 1} of {filteredChapters.length}
            </span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};