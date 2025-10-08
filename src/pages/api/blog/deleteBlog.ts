import blogController from "@/controllers/blogControllers";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    return blogController.deleteBlog(req, res);
};

export default handler;