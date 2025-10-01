import type { NextApiRequest, NextApiResponse } from "next";
import authController from "@/controllers/authController";

type Data = {
  id: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    authController.login(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
