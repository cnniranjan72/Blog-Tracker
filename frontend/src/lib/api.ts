// src/lib/api.ts
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from '../types/blog';

// Mock API base URL - replace with your actual FastAPI backend URL
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-fastapi-backend.onrender.com'
    : 'http://localhost:8000';

// Get Firebase ID token for authenticated requests
const getAuthToken = async () => {
  return localStorage.getItem('idToken') || '';
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
      email: 'john@example.com',
    },
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T00:00:00.000Z'),
    isPublic: true,
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
      email: 'john@example.com',
    },
    createdAt: new Date('2024-01-22T00:00:00.000Z'),
    updatedAt: new Date('2024-01-22T00:00:00.000Z'),
    isPublic: true,
  },
];

export const api = {
  getPublicBlogs: async (): Promise<Blog[]> => {
    try {
      // Production fetch example:
      // const response = await fetch(`${API_BASE_URL}/blogs/public`);
      // return response.json();

      return mockBlogs.filter(blog => blog.isPublic);
    } catch (error) {
      console.error('Error fetching public blogs:', error);
      throw new Error('Failed to fetch public blogs');
    }
  },

  getUserBlogs: async (): Promise<Blog[]> => {
    try {
      const token = await getAuthToken();
      // const response = await fetch(`${API_BASE_URL}/blogs/me`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // return response.json();

      return mockBlogs;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw new Error('Failed to fetch user blogs');
    }
  },

  getBlog: async (id: string): Promise<Blog> => {
    try {
      const blog = mockBlogs.find(b => b._id === id);
      if (!blog) throw new Error('Blog not found');
      return blog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw new Error('Failed to fetch blog');
    }
  },

  createBlog: async (blogData: CreateBlogRequest): Promise<Blog> => {
    try {
      const token = await getAuthToken();
      // Production example:
      // const response = await fetch(`${API_BASE_URL}/blogs`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(blogData),
      // });

      const newBlog: Blog = {
        _id: Date.now().toString(),
        ...blogData,
        authorId: 'user1',
        author: {
          displayName: 'John Doe',
          email: 'john@example.com',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: blogData.isPublic ?? true,
      };
      mockBlogs.unshift(newBlog);
      return newBlog;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new Error('Failed to create blog');
    }
  },

  updateBlog: async (blogData: UpdateBlogRequest): Promise<Blog> => {
    try {
      const token = await getAuthToken();
      const index = mockBlogs.findIndex(b => b._id === blogData._id);
      if (index === -1) throw new Error('Blog not found');

      const updatedBlog: Blog = {
        ...mockBlogs[index],
        ...blogData,
        updatedAt: new Date(),
      };
      mockBlogs[index] = updatedBlog;
      return updatedBlog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new Error('Failed to update blog');
    }
  },

  deleteBlog: async (id: string): Promise<void> => {
    try {
      const token = await getAuthToken();
      const index = mockBlogs.findIndex(b => b._id === id);
      if (index !== -1) mockBlogs.splice(index, 1);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new Error('Failed to delete blog');
    }
  },
};
