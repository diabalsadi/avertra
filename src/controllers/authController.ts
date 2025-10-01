import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "@/services/prismaService";
import * as argon from "argon2";
import { User } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import { generateToken, verifyToken } from "@/services/jwtService";

class AuthController {
  async register(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const hash = await argon.hash(password);

    prismaClient.user
      .create({
        data: {
          email,
          hash,
        },
      })
      .then((user: User) => {
        const token = generateToken(user.id);
        return res.status(200).json({ id: user.id, token });
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            return res.status(400).json({
              message: "User with this email already exists",
              id: "",
            });
          }
        }

        return res.status(500).json({
          message: error.message,
          id: "",
        });
      });
  }

  async login(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", id: "" });
    }

    const validPassword = await argon.verify(user.hash, password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", id: "" });
    }

    const token = generateToken(user.id);
    return res.status(200).json({ id: user.id, token });
  }

  async isAuthenticated(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    const authToken = req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const verified = await verifyToken(authToken);
    if (!verified) {
      return res.status(401).json({ message: "Not authorized" });
    }

    console.log(verified);
    next();
  }
}

export default new AuthController();
