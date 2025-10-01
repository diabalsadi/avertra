import prismaService from "@/services/prismaService";
import { NextApiRequest, NextApiResponse } from "next";

class BlogController {
  async getAllBlogs(req: NextApiRequest, res: NextApiResponse) {
    const blogs = await prismaService.blog.findMany();
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
}

export default new BlogController();
