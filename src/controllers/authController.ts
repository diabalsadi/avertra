import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "@/services/prismaService";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import {
  generateToken,
  isValidToken,
  verifyToken,
} from "@/services/jwtService";

class AuthController {
  async register(req: NextApiRequest, res: NextApiResponse) {
    const { email, password, firstName, lastName } = req.body;
    const hash = await argon.hash(password);

    try {
      const user = await prismaClient.user.create({
        data: {
          email,
          hash,
          firstName,
          lastName,
        },
      });

      const token = generateToken(user.id);

      // Return complete user data for NextAuth compatibility
      return res.status(200).json({
        id: user.id,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res.status(400).json({
            message: "User with this email already exists",
            id: "",
          });
        }
      }

      return res.status(500).json({
        message: error instanceof Error ? error.message : "Registration failed",
        id: "",
      });
    }
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

  async isAuthenticated(
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    const authToken = req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const verified = await verifyToken(authToken);
    if (!verified) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const isValid = isValidToken(
      verified as { exp: number; iat: number; id: string }
    );

    if (!isValid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    next();
  }

  async getUserFromToken(req: NextApiRequest, res: NextApiResponse) {
    const authToken = req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const verified = await verifyToken(authToken);
    if (!verified) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!isValidToken(verified as { exp: number; iat: number; id: string })) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: (verified as { id: string }).id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  }
}

export default new AuthController();
