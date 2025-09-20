import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { Blog } from '@/types/blog';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const userBlogs = await api.getUserBlogs();
        setBlogs(userBlogs);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your blogs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [toast]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteBlog(id);
      setBlogs(blogs.filter(blog => blog._id !== id));
      toast({
        title: "Success",
        description: "Blog deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength = 100) => {
    const plainText = content.replace(/#{1,6}\s+/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin glow-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                My Blogs
              </span>
            </h1>
            <p className="text-muted-foreground">
              Manage your internship journey posts
            </p>
          </div>
          
          <Button variant="neon" asChild>
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              New Blog
            </Link>
          </Button>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
              <Edit className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
            <p className="text-muted-foreground mb-6">
              Start documenting your internship journey by creating your first blog post.
            </p>
            <Button variant="neon" asChild>
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Blog
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card 
                key={blog._id} 
                className="group border-neon hover:glow-subtle transition-glow bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {blog.isPublic ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(blog.createdAt)}
                    {blog.updatedAt > blog.createdAt && (
                      <span className="text-xs">(edited)</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {getExcerpt(blog.content)}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="glass" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/blog/${blog._id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/edit/${blog._id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;