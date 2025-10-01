import { NextApiRequest, NextApiResponse } from "next";
import blogControllers from "@/controllers/blogControllers";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    return blogControllers.updateBlog(req, res);
};

export default handler;