import blogControllers from "@/controllers/blogControllers";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    blogControllers.getArticle(req, res);
};

export default handler;
