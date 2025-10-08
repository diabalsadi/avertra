import { isValidToken, verifyToken } from "@/services/jwtService";
import prismaService from "@/services/prismaService";
import { NextApiRequest, NextApiResponse } from "next";

class BlogController {
  async getAllBlogs(req: NextApiRequest, res: NextApiResponse) {
    const offset = parseInt((req.query.offset as string) || "0", 10);
    const blogs = await prismaService.blog.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imgSrc: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Most recently updated blogs first
      },
      take: 10, // Limit to 10 blogs
      skip: offset, // Skip blogs for pagination
    });

    res.json(blogs);
  }

  async createBlog(req: NextApiRequest, res: NextApiResponse) {
    const { title, description, imgSrc, userId } = req.body;

    const newBlog = await prismaService.blog
      .create({
        data: {
          title,
          description,
          imgSrc,
          userId,
        },
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: "Error creating blog", details: error.message });
      });

    res.status(201).json(newBlog);
  }

  async deleteBlog(req: NextApiRequest, res: NextApiResponse) {
    // Check for token in header for authentication
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify token
    const verified = await verifyToken(token);
    const isValid = isValidToken(verified as { exp: number; iat: number; id: string });
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = (verified as { id: string }).id;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    try {
      // First, check if the blog exists and if the user owns it
      const blog = await prismaService.blog.findUnique({
        where: {
          id: id as string,
        },
        select: {
          id: true,
          userId: true,
          title: true,
        },
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Check if the authenticated user owns this blog
      if (blog.userId !== userId) {
        return res.status(403).json({ 
          error: "Forbidden: You can only delete your own blog posts" 
        });
      }

      // If user owns the blog, proceed with deletion
      await prismaService.blog.delete({
        where: {
          id: id as string,
        },
      });

      res.status(200).json({ 
        message: "Blog deleted successfully",
        deletedBlog: {
          id: blog.id,
          title: blog.title
        }
      });
    } catch (error: unknown) {
      res.status(500).json({
        error: "Error deleting blog",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getArticle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Article ID is required" });
    }

    try {
      const article = await prismaService.blog.findUnique({
        where: {
          id: id as string,
        },
      });

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json(article);
    } catch (error: unknown) {
      res.status(500).json({
        error: "Error fetching article",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async updateBlog(req: NextApiRequest, res: NextApiResponse) {
    // Check for token in header for authentication
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const verified = await verifyToken(token);
    const isValid = isValidToken(verified as { exp: number; iat: number; id: string });
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = (verified as { id: string }).id;
    const { id } = req.query;
    const { title, description, imgSrc } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    try {
      // First, check if the blog exists and if the user owns it
      const existingBlog = await prismaService.blog.findUnique({
        where: {
          id: id as string,
        },
        select: {
          id: true,
          userId: true,
          title: true,
        },
      });

      if (!existingBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Check if the authenticated user owns this blog
      if (existingBlog.userId !== userId) {
        return res.status(403).json({ 
          error: "Forbidden: You can only update your own blog posts" 
        });
      }

      // If user owns the blog, proceed with update
      const updatedBlog = await prismaService.blog.update({
        where: {
          id: id as string,
        },
        data: {
          title,
          description,
          imgSrc,
        },
      });

      res.json(updatedBlog);
    } catch (error: unknown) {
      res.status(500).json({
        error: "Error updating blog",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

const blogController = new BlogController();
export default blogController;
