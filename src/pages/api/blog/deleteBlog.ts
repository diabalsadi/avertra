import blogController from "@/controllers/blogControllers";
import { NextApiRequest, NextApiResponse } from "next";
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    blogController.deleteBlog(req, res);
};

export default handle;