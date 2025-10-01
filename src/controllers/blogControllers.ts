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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    try {
      await prismaService.blog.delete({
        where: {
          id: id as string,
        },
      });

      res.status(204).json({ message: "Blog deleted successfully" });
    } catch (error: unknown) {
      res.status(500).json({
        error: "Error deleting blog",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export default new BlogController();
