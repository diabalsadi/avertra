import BlogController from './blogControllers'; // adjust if path differs
import prismaService from '@/services/prismaService';
import { isValidToken, verifyToken } from '@/services/jwtService';
import { NextApiRequest, NextApiResponse } from 'next';

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));

const mockRes = {
  status: mockStatus,
  json: mockJson,
} as unknown as NextApiResponse;

// ✅ Correctly mock the prismaService (default export)
jest.mock('@/services/prismaService', () => ({
  __esModule: true,
  default: {
    blog: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// ✅ Correctly mock jwtService
jest.mock('@/services/jwtService', () => ({
  isValidToken: jest.fn(),
  verifyToken: jest.fn(),
}));

describe('BlogController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBlogs', () => {
    it('should return list of blogs', async () => {
      const mockBlogs = [
        {
          id: '1',
          title: 'Test',
          description: 'Desc',
          imgSrc: 'img.jpg',
          createdAt: '',
          updatedAt: '',
          user: { id: 'u1', firstName: 'A', lastName: 'B' },
        },
      ];
      (prismaService.blog.findMany as jest.Mock).mockResolvedValue(mockBlogs);

      const mockReq = { query: { offset: '0' } } as unknown as NextApiRequest;

      await BlogController.getAllBlogs(mockReq, mockRes);

      expect(prismaService.blog.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockBlogs);
    });
  });

  describe('createBlog', () => {
    it('should create a new blog and return it', async () => {
      const blogInput = {
        title: 'New',
        description: 'New Desc',
        imgSrc: '',
        userId: 'u1',
      };

      const newBlog = {
        ...blogInput,
        id: '1',
      };

      (prismaService.blog.create as jest.Mock).mockResolvedValue(newBlog);

      const mockReq = {
        body: blogInput,
      } as unknown as NextApiRequest;

      await BlogController.createBlog(mockReq, mockRes);

      expect(prismaService.blog.create).toHaveBeenCalledWith({ data: blogInput });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(newBlog);
    });

    it('should return 500 if create fails', async () => {
      (prismaService.blog.create as jest.Mock).mockRejectedValue(
        new Error('Create error')
      );

      const mockReq = {
        body: {
          title: 'Test',
          description: 'Desc',
          imgSrc: '',
          userId: 'u1',
        },
      } as unknown as NextApiRequest;

      await BlogController.createBlog(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error creating blog',
        details: 'Create error',
      });
    });
  });

  describe('deleteBlog', () => {
    it('should delete a blog successfully', async () => {
      (prismaService.blog.delete as jest.Mock).mockResolvedValue({});

      const mockReq = { query: { id: '1' } } as unknown as NextApiRequest;

      await BlogController.deleteBlog(mockReq, mockRes);

      expect(prismaService.blog.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Blog deleted successfully',
      });
    });

    it('should return 400 if id is missing', async () => {
      const mockReq = { query: {} } as unknown as NextApiRequest;

      await BlogController.deleteBlog(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Blog ID is required' });
    });
  });

  describe('getArticle', () => {
    it('should return article if found', async () => {
      const article = { id: '1', title: 'Article' };
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(article);

      const mockReq = { query: { id: '1' } } as unknown as NextApiRequest;

      await BlogController.getArticle(mockReq, mockRes);

      expect(prismaService.blog.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockJson).toHaveBeenCalledWith(article);
    });

    it('should return 404 if article not found', async () => {
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(null);

      const mockReq = { query: { id: '1' } } as unknown as NextApiRequest;

      await BlogController.getArticle(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Article not found' });
    });

    it('should return 500 on DB error', async () => {
      (prismaService.blog.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const mockReq = { query: { id: '1' } } as unknown as NextApiRequest;

      await BlogController.getArticle(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error fetching article',
        details: 'Database error',
      });
    });
  });

  describe('updateBlog', () => {
    it('should return 401 if token is missing', async () => {
      const mockReq = {
        headers: {},
        query: { id: '1' },
        body: {},
      } as unknown as NextApiRequest;

      await BlogController.updateBlog(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 if token is invalid', async () => {
      (verifyToken as jest.Mock).mockResolvedValue({ id: 'user1', exp: 999999, iat: 1 });
      (isValidToken as jest.Mock).mockReturnValue(false);

      const mockReq = {
        headers: { authorization: 'Bearer token123' },
        query: { id: '1' },
        body: {},
      } as unknown as NextApiRequest;

      await BlogController.updateBlog(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should update blog if token is valid', async () => {
      const updatedBlog = {
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        imgSrc: 'updated-image.jpg',
      };

      (verifyToken as jest.Mock).mockResolvedValue({ id: 'user1', exp: 999999, iat: 1 });
      (isValidToken as jest.Mock).mockReturnValue(true);
      (prismaService.blog.update as jest.Mock).mockResolvedValue(updatedBlog);

      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
        query: { id: '1' },
        body: {
          title: 'Updated Title',
          description: 'Updated Description',
          imgSrc: 'updated-image.jpg',
        },
      } as unknown as NextApiRequest;

      await BlogController.updateBlog(mockReq, mockRes);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(isValidToken).toHaveBeenCalled();
      expect(prismaService.blog.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated Title',
          description: 'Updated Description',
          imgSrc: 'updated-image.jpg',
        },
      });
      expect(mockJson).toHaveBeenCalledWith(updatedBlog);
    });

    it('should return 500 if DB update fails', async () => {
      (verifyToken as jest.Mock).mockResolvedValue({ id: 'user1', exp: 999999, iat: 1 });
      (isValidToken as jest.Mock).mockReturnValue(true);
      (prismaService.blog.update as jest.Mock).mockRejectedValue(new Error('Update error'));

      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
        query: { id: '1' },
        body: {
          title: 'Updated',
          description: 'Updated',
          imgSrc: '',
        },
      } as unknown as NextApiRequest;

      await BlogController.updateBlog(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error updating blog',
        details: 'Update error',
      });
    });
  });
});
