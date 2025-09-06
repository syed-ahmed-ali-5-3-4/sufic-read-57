import { useState, useEffect } from 'react';

interface Note {
  id: string;
  chapterId: number;
  content: string;
  timestamp: number;
  position?: number; // position in chapter where note was added
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('islamic-book-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('islamic-book-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (chapterId: number, content: string, position?: number) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${chapterId}`,
      chapterId,
      content,
      timestamp: Date.now(),
      position
    };
    
    setNotes(prev => [...prev, newNote]);
    return newNote.id;
  };

  const updateNote = (noteId: string, content: string) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId 
          ? { ...note, content, timestamp: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const getNotesByChapter = (chapterId: number) => {
    return notes.filter(note => note.chapterId === chapterId);
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByChapter
  };
};