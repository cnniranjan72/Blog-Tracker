import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import MDEditor from '@uiw/react-md-editor';
import { Save, ArrowLeft, Plus, X, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# My Internship Experience\n\nWrite about your journey here...');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your blog.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await api.createBlog({
        title: title.trim(),
        content: content.trim(),
        tags,
        isPublic
      });

      toast({
        title: "Success!",
        description: "Your blog has been published successfully.",
      });

      navigate('/my-blogs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/my-blogs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Create New Blog
              </span>
            </h1>
            <p className="text-muted-foreground">
              Document your internship journey
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card className="border-neon bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Blog Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Enter your blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg border-primary/20 focus:border-primary/50"
                    required
                  />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="border-neon bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px]">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      preview="edit"
                      height={400}
                      data-color-mode="dark"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card className="border-neon bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {isPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-toggle" className="text-sm font-medium">
                        Public
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {isPublic 
                          ? 'Anyone can view this blog' 
                          : 'Only you can view this blog'
                        }
                      </p>
                    </div>
                    <Switch
                      id="public-toggle"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-neon bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 border-primary/20 focus:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 group cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1 group-hover:text-destructive" />
                      </Badge>
                    ))}
                  </div>

                  {tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add tags to help categorize your blog post
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Publish Button */}
              <Button
                type="submit"
                variant="neon"
                className="w-full"
                disabled={loading || !title.trim() || !content.trim()}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Publish Blog
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;