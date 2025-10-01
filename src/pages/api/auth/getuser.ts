import authController from "@/controllers/authController";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authController.getUserFromToken(req, res);
};

export default handler;
