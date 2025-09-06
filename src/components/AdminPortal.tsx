import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Languages,
  Users,
  Settings,
  FileText,
  Upload,
  Image
} from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  content: string;
  language: 'english' | 'urdu';
  status: 'published' | 'draft';
  lastModified: string;
  images?: string[];
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const sampleChapters: Chapter[] = [
  {
    id: 1,
    title: "Introduction to Islamic Healthcare Philosophy",
    content: "Healthcare in Islam is not merely a physical endeavor...",
    language: 'english',
    status: 'published',
    lastModified: '2024-01-15'
  },
  {
    id: 2,
    title: "اسلامی صحت کی فلسفہ کا تعارف",
    content: "اسلام میں صحت کی دیکھ بھال صرف جسمانی کوشش نہیں...",
    language: 'urdu',
    status: 'published',
    lastModified: '2024-01-15'
  }
];

const sampleTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    rating: 5,
    text: "This book beautifully bridges the gap between Islamic wisdom...",
    status: 'pending',
    date: '2024-01-20'
  },
  {
    id: 2,
    name: "Ahmad Ibn Muhammad",
    rating: 5,
    text: "ما شاء اللہ! This work provides profound insights...",
    status: 'approved',
    date: '2024-01-18'
  }
];

export const AdminPortal = () => {
  const [chapters, setChapters] = useState(sampleChapters);
  const [testimonials, setTestimonials] = useState(sampleTestimonials);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [newChapter, setNewChapter] = useState({
    title: '',
    content: '',
    language: 'english' as 'english' | 'urdu',
    status: 'draft' as 'published' | 'draft',
    images: [] as string[]
  });

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.content) {
      const chapter: Chapter = {
        id: chapters.length + 1,
        ...newChapter,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      setChapters([...chapters, chapter]);
      setNewChapter({ title: '', content: '', language: 'english', status: 'draft', images: [] });
      setShowAddChapter(false);
      toast({
        title: "Chapter Added",
        description: "New chapter has been created successfully.",
      });
    }
  };

  const handleTestimonialAction = (id: number, action: 'approved' | 'rejected') => {
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: action } : t
    ));
  };

  const handleDeleteChapter = (id: number) => {
    setChapters(chapters.filter(c => c.id !== id));
    toast({
      title: "Chapter Deleted",
      description: "Chapter has been removed successfully.",
    });
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setNewChapter({
      title: chapter.title,
      content: chapter.content,
      language: chapter.language,
      status: chapter.status,
      images: chapter.images || []
    });
  };

  const handleUpdateChapter = () => {
    if (editingChapter && newChapter.title && newChapter.content) {
      const updatedChapter: Chapter = {
        ...editingChapter,
        ...newChapter,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      setChapters(chapters.map(c => c.id === editingChapter.id ? updatedChapter : c));
      setEditingChapter(null);
      setNewChapter({ title: '', content: '', language: 'english', status: 'draft', images: [] });
      toast({
        title: "Chapter Updated",
        description: "Chapter has been updated successfully.",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          setUploadedImages(prev => [...prev, imageDataUrl]);
          setNewChapter(prev => ({ ...prev, images: [...prev.images, imageDataUrl] }));
        };
        reader.readAsDataURL(file);
      });
      toast({
        title: "Images Uploaded",
        description: `${files.length} image(s) uploaded successfully.`,
      });
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setNewChapter(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: 'default',
      draft: 'secondary',
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-amiri gradient-text font-bold mb-4">
              Admin Portal
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your Islamic healthcare book content and testimonials
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="chapters" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Chapters
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Testimonials
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-card border-border">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Chapters</p>
                        <p className="text-3xl font-bold text-primary">{chapters.length}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-card border-border">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Published</p>
                        <p className="text-3xl font-bold text-primary">
                          {chapters.filter(c => c.status === 'published').length}
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-card border-border">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Testimonials</p>
                        <p className="text-3xl font-bold text-primary">{testimonials.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-card border-border">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                        <p className="text-3xl font-bold text-primary">
                          {testimonials.filter(t => t.status === 'pending').length}
                        </p>
                      </div>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="bg-gradient-card border-border">
                <div className="p-6">
                  <h3 className="text-xl font-amiri gradient-text font-bold mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">New testimonial received from Dr. Sarah Ahmed</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Chapter "Islamic Healthcare Ethics" updated</span>
                      <span className="text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">New Urdu translation published</span>
                      <span className="text-muted-foreground">3 days ago</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Chapters Tab */}
            <TabsContent value="chapters" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-amiri gradient-text font-bold">
                  Manage Chapters
                </h2>
                <Button
                  variant="islamic"
                  onClick={() => setShowAddChapter(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Chapter
                </Button>
              </div>

              {/* Add Chapter Form */}
              {showAddChapter && (
                <Card className="bg-gradient-card border-border">
                  <div className="p-6">
                    <h3 className="text-xl font-amiri gradient-text font-bold mb-4">
                      Add New Chapter
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Chapter Title
                          </label>
                          <Input
                            value={newChapter.title}
                            onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                            placeholder="Enter chapter title"
                            className="bg-background-medium border-border"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Language
                          </label>
                          <select
                            value={newChapter.language}
                            onChange={(e) => setNewChapter({...newChapter, language: e.target.value as 'english' | 'urdu'})}
                            className="w-full h-10 px-3 bg-background-medium border border-border rounded-md text-foreground"
                          >
                            <option value="english">English</option>
                            <option value="urdu">اردو</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Chapter Content
                        </label>
                        <Textarea
                          value={newChapter.content}
                          onChange={(e) => setNewChapter({...newChapter, content: e.target.value})}
                          placeholder="Enter chapter content..."
                          className="bg-background-medium border-border min-h-[200px]"
                        />
                      </div>

                      {/* Image Upload Section */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Chapter Images
                        </label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Upload Images
                            </Button>
                          </div>
                          
                          {newChapter.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {newChapter.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Chapter image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded border border-border"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveImage(image)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button variant="islamic" onClick={editingChapter ? handleUpdateChapter : handleAddChapter}>
                          {editingChapter ? 'Update Chapter' : 'Save Chapter'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddChapter(false);
                            setEditingChapter(null);
                            setNewChapter({ title: '', content: '', language: 'english', status: 'draft', images: [] });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Chapters List */}
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <Card key={chapter.id} className="bg-gradient-card border-border">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {chapter.title}
                            </h3>
                            <Badge variant={getStatusBadge(chapter.status)}>
                              {chapter.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Languages className="h-4 w-4" />
                              {chapter.language === 'english' ? 'English' : 'اردو'}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last modified: {chapter.lastModified}
                          </p>
                          <p className="text-sm text-foreground/80 mt-2 line-clamp-2">
                            {chapter.content.substring(0, 150)}...
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => handleEditChapter(chapter)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteChapter(chapter.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-8">
              <h2 className="text-2xl font-amiri gradient-text font-bold">
                Manage Testimonials
              </h2>

              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-gradient-card border-border">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {testimonial.name}
                            </h3>
                            <Badge variant={getStatusBadge(testimonial.status)}>
                              {testimonial.status}
                            </Badge>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className="text-primary">★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Submitted: {testimonial.date}
                          </p>
                          <p className="text-foreground/90">
                            "{testimonial.text}"
                          </p>
                        </div>
                        
                        {testimonial.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="islamic" 
                              size="sm"
                              onClick={() => handleTestimonialAction(testimonial.id, 'approved')}
                              className="flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleTestimonialAction(testimonial.id, 'rejected')}
                              className="flex items-center gap-1"
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};