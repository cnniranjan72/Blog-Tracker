import { Blog, CreateBlogRequest, UpdateBlogRequest } from '@/types/blog';

// Mock API base URL - replace with your actual FastAPI backend URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-fastapi-backend.onrender.com' 
  : 'http://localhost:8000';

// Get Firebase ID token for authenticated requests
const getAuthToken = async () => {
  // This will be implemented when Firebase auth is set up
  return localStorage.getItem('mockAuthToken') || '';
};

// Mock data for development
const mockBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Starting My Internship Journey',
    content: `# Week 1: First Impressions

Today I started my software engineering internship at TechCorp. The onboarding process was smooth, and I'm excited to dive into real-world development.

## Key Learnings
- Company culture is very collaborative
- Tech stack: React, Node.js, MongoDB
- Agile development methodology

## Goals for Next Week
- [ ] Complete the development environment setup
- [ ] Attend first sprint planning meeting
- [ ] Start working on my first ticket`,
    tags: ['internship', 'week1', 'onboarding'],
    authorId: 'user1',
    author: {
      displayName: 'John Doe',
      email: 'john@example.com'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isPublic: true
  },
  {
    _id: '2',
    title: 'Learning React Best Practices',
    content: `# React Components Architecture

Been diving deep into React component patterns and best practices this week.

## Key Concepts Learned
- Custom hooks for state management
- Component composition patterns
- Performance optimization with useMemo and useCallback

The senior developers here are really helpful in code reviews!`,
    tags: ['react', 'learning', 'development'],
    authorId: 'user1',
    author: {
      displayName: 'John Doe',
      email: 'john@example.com'
    },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    isPublic: true
  }
];

export const api = {
  // Get all public blogs
  getPublicBlogs: async (): Promise<Blog[]> => {
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/blogs`);
      // return response.json();
      
      // Mock implementation
      return mockBlogs.filter(blog => blog.isPublic);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw new Error('Failed to fetch blogs');
    }
  },

  // Get user's blogs
  getUserBlogs: async (): Promise<Blog[]> => {
    try {
      const token = await getAuthToken();
      // const response = await fetch(`${API_BASE_URL}/blogs/mine`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mock implementation
      return mockBlogs;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw new Error('Failed to fetch user blogs');
    }
  },

  // Get single blog
  getBlog: async (id: string): Promise<Blog> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
      
      // Mock implementation
      const blog = mockBlogs.find(b => b._id === id);
      if (!blog) throw new Error('Blog not found');
      return blog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw new Error('Failed to fetch blog');
    }
  },

  // Create blog
  createBlog: async (blogData: CreateBlogRequest): Promise<Blog> => {
    try {
      const token = await getAuthToken();
      // const response = await fetch(`${API_BASE_URL}/blogs`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(blogData)
      // });
      
      // Mock implementation
      const newBlog: Blog = {
        _id: Date.now().toString(),
        ...blogData,
        authorId: 'user1',
        author: {
          displayName: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockBlogs.unshift(newBlog);
      return newBlog;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new Error('Failed to create blog');
    }
  },

  // Update blog
  updateBlog: async (blogData: UpdateBlogRequest): Promise<Blog> => {
    try {
      const token = await getAuthToken();
      // const response = await fetch(`${API_BASE_URL}/blogs/${blogData._id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(blogData)
      // });
      
      // Mock implementation
      const index = mockBlogs.findIndex(b => b._id === blogData._id);
      if (index === -1) throw new Error('Blog not found');
      
      const updatedBlog = {
        ...mockBlogs[index],
        ...blogData,
        updatedAt: new Date()
      };
      mockBlogs[index] = updatedBlog;
      return updatedBlog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new Error('Failed to update blog');
    }
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<void> => {
    try {
      const token = await getAuthToken();
      // await fetch(`${API_BASE_URL}/blogs/${id}`, {
      //   method: 'DELETE',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mock implementation
      const index = mockBlogs.findIndex(b => b._id === id);
      if (index !== -1) {
        mockBlogs.splice(index, 1);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new Error('Failed to delete blog');
    }
  }
};