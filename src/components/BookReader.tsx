import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ChapterNavigation } from '@/components/ChapterNavigation';
import { SearchDialog } from '@/components/SearchDialog';
import { BookmarksPanel } from '@/components/BookmarksPanel';
import { NotesPanel } from '@/components/NotesPanel';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Search, 
  Bookmark, 
  StickyNote, 
  Settings, 
  Sun, 
  Languages 
} from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  content: string;
  language: 'english' | 'urdu';
}

const sampleChapters: Chapter[] = [
  {
    id: 1,
    title: "Introduction to Islamic Healthcare Philosophy",
    content: `In the name of Allah, the Most Gracious, the Most Merciful.

Healthcare in Islam is not merely a physical endeavor but a holistic approach that encompasses the spiritual, mental, and physical well-being of the individual. The concept of human autonomy within Islamic healthcare science represents a profound understanding that bridges ancient wisdom with modern medical ethics.

The Quran states: "And whoever saves a life, it is as though he has saved all of mankind" (5:32). This verse encapsulates the sacred duty of preserving life while respecting the divine autonomy granted to each individual.

In this exploration, we delve into how Islamic principles guide healthcare decisions while honoring the fundamental concept of free will (ikhtiyar) that Allah has bestowed upon humanity. The balance between divine guidance and human choice forms the cornerstone of ethical healthcare practice in Islamic tradition.

Through the lens of Sufi spirituality, we understand that true healing encompasses not just the body, but the purification of the soul (tazkiyah) and the alignment of one's will with divine wisdom. This comprehensive approach to healthcare acknowledges that each individual possesses an innate capacity for self-determination while remaining connected to the divine source of all healing.`,
    language: 'english'
  },
  {
    id: 2,
    title: "اسلامی صحت کی فلسفہ کا تعارف",
    content: `بسم اللہ الرحمن الرحیم

اسلام میں صحت کی دیکھ بھال صرف جسمانی کوشش نہیں بلکہ ایک جامع نقطہ نظر ہے جو فرد کی روحانی، ذہنی اور جسمانی بہبودی کو شامل کرتا ہے۔ اسلامی صحت کی سائنس کے اندر انسانی خودمختاری کا تصور ایک گہری فہم کو ظاہر کرتا ہے جو قدیم حکمت کو جدید طبی اخلاقیات سے جوڑتا ہے۔

قرآن میں ارشاد ہے: "اور جو کوئی ایک جان کو بچائے، گویا اس نے تمام انسانوں کو بچایا" (5:32)۔ یہ آیت زندگی کے تحفظ کی مقدس ذمہ داری کو سمیٹتی ہے جبکہ ہر فرد کو عطا کردہ الہی خودمختاری کا احترام کرتی ہے۔

اس تجسس میں، ہم یہ دیکھتے ہیں کہ اسلامی اصول کیسے صحت کی دیکھ بھال کے فیصلوں میں رہنمائی کرتے ہیں جبکہ آزاد مرضی (اختیار) کے بنیادی تصور کا احترام کرتے ہیں جو اللہ نے انسانوں کو عطا کیا ہے۔`,
    language: 'urdu'
  }
];

export const BookReader = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [language, setLanguage] = useState<'english' | 'urdu'>('english');
  const [fontSize, setFontSize] = useState([16]);
  const [brightness, setBrightness] = useState([80]);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  const { bookmarks, isChapterBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { getNotesByChapter } = useNotes();
  const { toast } = useToast();

  const currentChapters = sampleChapters.filter(chapter => chapter.language === language);
  const chapter = currentChapters[currentChapter];

  const toggleBookmark = () => {
    console.log('Current chapter:', chapter);
    console.log('Current bookmarks:', bookmarks);
    console.log('Is chapter bookmarked?', isChapterBookmarked(chapter.id));
    
    if (isChapterBookmarked(chapter.id)) {
      // Find the actual bookmark for this chapter and remove it
      const chapterBookmarks = bookmarks.filter(bookmark => bookmark.chapterId === chapter.id);
      if (chapterBookmarks.length > 0) {
        removeBookmark(chapterBookmarks[0].id);
      }
      toast({
        title: "Bookmark Removed",
        description: `Removed bookmark from "${chapter.title}"`,
      });
    } else {
      console.log('Adding bookmark for chapter:', chapter.id, chapter.title);
      addBookmark(chapter.id, chapter.title, 0);
      toast({
        title: "Bookmark Added",
        description: `Bookmarked "${chapter.title}"`,
      });
    }
  };

  const handleNavigateToChapter = (chapterId: number) => {
    const chapterIndex = currentChapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex !== -1) {
      setCurrentChapter(chapterIndex);
    }
  };

  const chapterNotes = getNotesByChapter(chapter.id);

  return (
    <div className="min-h-screen bg-gradient-background flex" style={{filter: `brightness(${brightness[0]}%)`}}>
      {/* Chapter Navigation Sidebar */}
      <ChapterNavigation
        chapters={sampleChapters}
        currentChapter={currentChapter}
        onChapterChange={setCurrentChapter}
        language={language}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        {/* Reading Header */}
        <div className="backdrop-islamic border-b border-border p-4 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-amiri gradient-text font-bold">
                Islamic Healthcare Wisdom
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="text-primary hover:bg-primary/10"
                title="Search chapters"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBookmarks(true)}
                className="text-primary hover:bg-primary/10"
                title="View bookmarks"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'english' ? 'urdu' : 'english')}
                className="text-primary hover:bg-primary/10"
              >
                <Languages className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-primary hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Settings Panel */}
            {showSettings && (
              <Card className="mb-8 bg-gradient-card border-border animate-fade-in">
                <div className="p-6">
                  <h3 className="text-lg font-amiri gradient-text font-bold mb-6">Reading Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Font Size: {fontSize[0]}px
                      </label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        max={24}
                        min={12}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Brightness: {brightness[0]}%
                      </label>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        max={100}
                        min={50}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Chapter Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                disabled={currentChapter === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">
                  {language === 'english' ? 'English' : 'اردو'}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Chapter {currentChapter + 1} of {currentChapters.length}
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentChapter(Math.min(currentChapters.length - 1, currentChapter + 1))}
                disabled={currentChapter === currentChapters.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Reading Content */}
            <Card className="bg-gradient-card border-border mb-8 animate-page-flip">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 
                    className={`text-3xl font-amiri gradient-text font-bold ${language === 'urdu' ? 'text-right' : 'text-left'}`}
                    style={{fontSize: `${fontSize[0] + 8}px`}}
                  >
                    {chapter.title}
                  </h1>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleBookmark}
                      className={`${isChapterBookmarked(chapter.id) ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                      title={isChapterBookmarked(chapter.id) ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      <Bookmark className="h-5 w-5" fill={isChapterBookmarked(chapter.id) ? 'currentColor' : 'none'} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNotes(true)}
                      className={`${chapterNotes.length > 0 ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                      title={`${chapterNotes.length} note(s) in this chapter`}
                    >
                      <StickyNote className="h-5 w-5" fill={chapterNotes.length > 0 ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                </div>
                
                <div 
                  className={`prose prose-lg max-w-none reading-text ${
                    language === 'urdu' ? 'arabic-text' : ''
                  } text-foreground`}
                  style={{fontSize: `${fontSize[0]}px`}}
                >
                  {chapter.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Card>

            {/* Reading Progress */}
              <div className="text-center">
                <div className="inline-flex items-center gap-4 bg-card-elevated rounded-full px-6 py-3 border border-border">
                  <Search className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {chapterNotes.length} Notes • Progress: {Math.round(((currentChapter + 1) / currentChapters.length) * 100)}%
                  </span>
                </div>
              </div>
          </div>
        </div>

        {/* Search Dialog */}
        <SearchDialog
          chapters={sampleChapters}
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onChapterSelect={setCurrentChapter}
          language={language}
        />

        {/* Bookmarks Panel */}
        <BookmarksPanel
          isOpen={showBookmarks}
          onClose={() => setShowBookmarks(false)}
          onNavigateToChapter={handleNavigateToChapter}
        />

        {/* Notes Panel */}
        <NotesPanel
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          currentChapterId={chapter.id}
          chapterTitle={chapter.title}
        />
      </div>
    </div>
  );
};