import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  chapterId: number;
  chapterTitle: string;
  position: number; // percentage of chapter read
  timestamp: number;
  note?: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('islamic-book-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('islamic-book-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (chapterId: number, chapterTitle: string, position: number = 0, note?: string) => {
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}-${chapterId}`,
      chapterId,
      chapterTitle,
      position,
      timestamp: Date.now(),
      note
    };
    
    setBookmarks(prev => {
      const updated = [...prev, newBookmark];
      console.log('Adding bookmark:', newBookmark);
      console.log('Updated bookmarks:', updated);
      return updated;
    });
    return newBookmark.id;
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const updateBookmark = (bookmarkId: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev => 
      prev.map(bookmark => 
        bookmark.id === bookmarkId 
          ? { ...bookmark, ...updates }
          : bookmark
      )
    );
  };

  const getBookmarksByChapter = (chapterId: number) => {
    return bookmarks.filter(bookmark => bookmark.chapterId === chapterId);
  };

  const isChapterBookmarked = (chapterId: number) => {
    return bookmarks.some(bookmark => bookmark.chapterId === chapterId);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmark,
    getBookmarksByChapter,
    isChapterBookmarked
  };
};