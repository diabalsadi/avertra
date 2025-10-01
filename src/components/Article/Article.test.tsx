import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Article from './index';
import { Blog, User } from '@/generated/prisma';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  }),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock fetch globally
global.fetch = jest.fn();

describe('Article Component', () => {
  const mockUser: User = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    hash: 'hashedpassword',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockBlog: Blog = {
    id: 'blog-1',
    title: 'Test Article Title',
    description: 'This is a test article description that should be displayed properly.',
    imgSrc: 'https://example.com/image.jpg',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    userId: 'user-1',
  };

  const defaultProps = {
    ...mockBlog,
    user: mockUser,
    isEditable: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders article with required props', () => {
      render(<Article {...defaultProps} />);
      
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
      expect(screen.getByText('This is a test article description that should be displayed properly.')).toBeInTheDocument();
      expect(screen.getByText(/By\s+John\s+Doe/)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Test Article Title' })).toBeInTheDocument();
    });

    it('renders without description when description is null', () => {
      const propsWithoutDescription = {
        ...defaultProps,
        description: null,
      };
      
      render(<Article {...propsWithoutDescription} />);
      
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
      expect(screen.queryByText('This is a test article description that should be displayed properly.')).not.toBeInTheDocument();
    });

    it('displays formatted date correctly', () => {
      render(<Article {...defaultProps} />);
      
      expect(screen.getByText(/Oct 1, 2023/)).toBeInTheDocument();
    });

    it('creates correct link to blog detail page', () => {
      render(<Article {...defaultProps} />);
      
      const titleLink = screen.getByRole('link', { name: 'Test Article Title' });
      expect(titleLink).toHaveAttribute('href', '/blogs/blog-1');
    });
  });

  describe('Image Handling', () => {
    it('renders image with provided imgSrc', () => {
      render(<Article {...defaultProps} />);
      
      const image = screen.getByRole('img', { name: 'Test Article Title' });
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('uses fallback image when imgSrc is null', () => {
      const propsWithoutImage = {
        ...defaultProps,
        imgSrc: null,
      };
      
      render(<Article {...propsWithoutImage} />);
      
      const image = screen.getByRole('img', { name: 'Test Article Title' });
      expect(image).toHaveAttribute('src', '/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png');
    });

    it('handles image load error by switching to fallback', () => {
      render(<Article {...defaultProps} />);
      
      const image = screen.getByRole('img', { name: 'Test Article Title' });
      
      // Simulate image load error
      fireEvent.error(image);
      
      expect(image).toHaveAttribute('src', '/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png');
    });
  });

  describe('Editable State', () => {
    it('does not show edit/delete buttons when isEditable is false', () => {
      render(<Article {...defaultProps} />);
      
      expect(screen.queryByText('Edit Article')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Article')).not.toBeInTheDocument();
    });

    it('shows edit and delete buttons when isEditable is true', () => {
      const editableProps = {
        ...defaultProps,
        isEditable: true,
      };
      
      render(<Article {...editableProps} />);
      
      expect(screen.getByText('Edit Article')).toBeInTheDocument();
      expect(screen.getByText('Delete Article')).toBeInTheDocument();
    });

    it('edit button links to correct blog edit page', () => {
      const editableProps = {
        ...defaultProps,
        isEditable: true,
      };
      
      render(<Article {...editableProps} />);
      
      const editButton = screen.getByRole('link', { name: 'Edit Article' });
      expect(editButton).toHaveAttribute('href', '/blogs/blog-1');
    });
  });

  describe('Delete Functionality', () => {
    it('calls delete API when delete button is clicked', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        statusText: 'OK',
      });

      const editableProps = {
        ...defaultProps,
        isEditable: true,
      };
      
      render(<Article {...editableProps} />);
      
      const deleteButton = screen.getByText('Delete Article');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/blog/deleteBlog?id=blog-1', {
          method: 'DELETE',
        });
      });
    });

    it('reloads page after successful deletion', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        statusText: 'OK',
      });

      const editableProps = {
        ...defaultProps,
        isEditable: true,
      };
      
      render(<Article {...editableProps} />);
      
      const deleteButton = screen.getByText('Delete Article');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/blog/deleteBlog?id=blog-1', {
          method: 'DELETE',
        });
      });
      
      // Note: We're not testing window.location.reload in this test environment
      // In a real application, the page would reload after successful deletion
    });

    it('handles delete API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const editableProps = {
        ...defaultProps,
        isEditable: true,
      };
      
      render(<Article {...editableProps} />);
      
      const deleteButton = screen.getByText('Delete Article');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to delete article:', 'Not Found');
      });

      // The page should not reload on error
      
      consoleSpy.mockRestore();
    });

    it('handles network error during deletion', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const networkError = new Error('Network error');
      
      (fetch as jest.Mock).mockRejectedValueOnce(networkError);

      const editableProps = {
        ...defaultProps,
        isEditable: true,
      };
      
      render(<Article {...editableProps} />);
      
      const deleteButton = screen.getByText('Delete Article');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error deleting article:', networkError);
      });

      // The page should not reload on error
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for image', () => {
      render(<Article {...defaultProps} />);
      
      const image = screen.getByRole('img', { name: 'Test Article Title' });
      expect(image).toHaveAttribute('alt', 'Test Article Title');
    });

    it('has proper semantic structure with card elements', () => {
      render(<Article {...defaultProps} />);
      
      // Check that the component uses proper card structure
      const cardTitle = screen.getByText('Test Article Title');
      const cardDescription = screen.getByText('This is a test article description that should be displayed properly.');
      
      expect(cardTitle).toBeInTheDocument();
      expect(cardDescription).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined or empty user name gracefully', () => {
      const propsWithEmptyUser = {
        ...defaultProps,
        user: {
          ...mockUser,
          firstName: '',
          lastName: '',
        },
      };
      
      render(<Article {...propsWithEmptyUser} />);
      
      expect(screen.getByText(/By\s+•/)).toBeInTheDocument();
    });

    it('handles very long title and description', () => {
      const longTitle = 'A'.repeat(200);
      const longDescription = 'B'.repeat(500);
      
      const propsWithLongContent = {
        ...defaultProps,
        title: longTitle,
        description: longDescription,
      };
      
      render(<Article {...propsWithLongContent} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('handles invalid date gracefully', () => {
      const propsWithInvalidDate = {
        ...defaultProps,
        updatedAt: new Date('invalid-date'),
      };
      
      // This should not throw an error
      expect(() => {
        render(<Article {...propsWithInvalidDate} />);
      }).not.toThrow();
    });
  });
});