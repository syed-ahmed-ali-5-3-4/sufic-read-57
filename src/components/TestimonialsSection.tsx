import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, MessageCircle, User, ThumbsUp, Plus } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
}

const sampleTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    location: "London, UK",
    rating: 5,
    text: "This book beautifully bridges the gap between Islamic wisdom and modern healthcare ethics. As a practicing physician, I found the insights on patient autonomy particularly enlightening. The author's Sufi perspective adds a spiritual dimension that is often missing in contemporary medical literature.",
    date: "2024-01-15",
    verified: true,
    helpful: 24
  },
  {
    id: 2,
    name: "Ahmad Ibn Muhammad",
    location: "Islamabad, Pakistan",
    rating: 5,
    text: "ما شاء اللہ! This work provides profound insights into how Islamic principles can guide healthcare decisions while respecting human dignity. The bilingual approach makes it accessible to both English and Urdu readers. A must-read for healthcare professionals.",
    date: "2024-01-10",
    verified: true,
    helpful: 18
  },
  {
    id: 3,
    name: "Fatima Al-Zahra",
    location: "Cairo, Egypt",
    rating: 4,
    text: "The book's exploration of divine guidance versus human autonomy in healthcare is thought-provoking. It helped me understand how to balance my medical training with my Islamic faith. The practical applications are particularly valuable.",
    date: "2024-01-05",
    verified: true,
    helpful: 15
  }
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(sampleTestimonials);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    location: '',
    rating: 5,
    text: ''
  });

  const handleSubmitTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      const testimonial: Testimonial = {
        id: testimonials.length + 1,
        ...newTestimonial,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0
      };
      
      setTestimonials([testimonial, ...testimonials]);
      setNewTestimonial({ name: '', location: '', rating: 5, text: '' });
      setShowAddForm(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-primary fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-amiri gradient-text font-bold mb-6">
              Reader Testimonials
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover how this book has transformed understanding of Islamic healthcare wisdom
            </p>
            
            <Button
              variant="islamic"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Share Your Experience
            </Button>
          </div>

          {/* Add Testimonial Form */}
          {showAddForm && (
            <Card className="mb-12 bg-gradient-card border-border animate-fade-in">
              <div className="p-8">
                <h3 className="text-2xl font-amiri gradient-text font-bold mb-6">
                  Share Your Testimonial
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Your Name
                    </label>
                    <Input
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                      placeholder="Enter your name"
                      className="bg-background-medium border-border"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Location
                    </label>
                    <Input
                      value={newTestimonial.location}
                      onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})}
                      placeholder="City, Country"
                      className="bg-background-medium border-border"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                          star <= newTestimonial.rating
                            ? 'text-primary fill-current'
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                        onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Review
                  </label>
                  <Textarea
                    value={newTestimonial.text}
                    onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
                    placeholder="Share your thoughts about this book..."
                    className="bg-background-medium border-border min-h-[120px]"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button variant="islamic" onClick={handleSubmitTestimonial}>
                    Submit Testimonial
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="bg-gradient-card border-border hover-golden transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          {testimonial.name}
                          {testimonial.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-foreground/90 leading-relaxed mb-4 text-sm">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{testimonial.helpful}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Stats Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-card border-border max-w-2xl mx-auto">
              <div className="p-8">
                <h3 className="text-2xl font-amiri gradient-text font-bold mb-6">
                  Community Impact
                </h3>
                
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {testimonials.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Reviews
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Rating
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {testimonials.filter(t => t.verified).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Verified Readers
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};