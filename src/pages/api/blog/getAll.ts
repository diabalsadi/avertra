import blogControllers from "@/controllers/blogControllers";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    blogControllers.getAllBlogs(req, res);
};

export default handler;
