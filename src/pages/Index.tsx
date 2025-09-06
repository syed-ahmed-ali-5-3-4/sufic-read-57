import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookReader } from '@/components/BookReader';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Book, Users, Home } from 'lucide-react';
import heroImage from '@/assets/islamic-healthcare-hero.jpg';
import bookCover from '@/assets/book-cover.png';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<'home' | 'reader' | 'testimonials'>('home');

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'reader':
        return <BookReader />;
      case 'testimonials':
        return <TestimonialsSection />;
      default:
        return <HomeSection setCurrentSection={setCurrentSection} />;
    }
  };

  if (currentSection !== 'home') {
    return (
      <div className="min-h-screen bg-gradient-background">
        <nav className="backdrop-islamic border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-amiri gradient-text font-bold">
              Islamic Healthcare Wisdom
            </h1>
            <Button
              variant="ghost"
              onClick={() => setCurrentSection('home')}
              className="text-foreground hover:text-primary"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </nav>
        {renderCurrentSection()}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-background islamic-pattern relative"
      style={{
        backgroundImage: `url(${bookCover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Backdrop overlay for readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-amiri gradient-text font-bold mb-6 animate-golden-glow">
            Human Autonomy & Healthcare
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            A Sufi Islamic Scholar's Perspective
          </p>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Explore the profound connection between Islamic wisdom and modern healthcare science 
            through the lens of human autonomy and spiritual well-being.
          </p>
        </div>

        <HomeSection setCurrentSection={setCurrentSection} />
      </div>
    </div>
  );
};

const HomeSection = ({ setCurrentSection }: { setCurrentSection: (section: 'home' | 'reader' | 'testimonials') => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Reading Section */}
      <Card className="bg-gradient-card border-border hover-golden group cursor-pointer transition-all duration-500" 
            onClick={() => setCurrentSection('reader')}>
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Book className="h-16 w-16 text-primary group-hover:animate-float" />
          </div>
          <h3 className="text-2xl font-amiri gradient-text font-bold mb-4">
            Start Reading
          </h3>
          <p className="text-foreground/80 mb-6 leading-relaxed">
            Dive into both English and Urdu translations with advanced reading features, 
            bookmarks, and personal annotations.
          </p>
          <Button variant="islamic" className="w-full">
            Begin Your Journey
          </Button>
        </div>
      </Card>

      {/* Testimonials Section */}
      <Card className="bg-gradient-card border-border hover-golden group cursor-pointer transition-all duration-500" 
            onClick={() => setCurrentSection('testimonials')}>
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Users className="h-16 w-16 text-primary group-hover:animate-float" />
          </div>
          <h3 className="text-2xl font-amiri gradient-text font-bold mb-4">
            Reader Testimonials
          </h3>
          <p className="text-foreground/80 mb-6 leading-relaxed">
            Discover how this book has impacted readers on their journey of understanding 
            Islamic healthcare wisdom.
          </p>
          <Button variant="islamic" className="w-full">
            Read Reviews
          </Button>
        </div>
      </Card>

    </div>
  );
};

export default Index;