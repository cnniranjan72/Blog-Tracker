export interface User {
  uid: string;
  email: string;
  displayName: string;
  joinedAt: Date;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  author?: {
    displayName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  _id: string;
}