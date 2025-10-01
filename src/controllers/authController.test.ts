// __tests__/authController.test.ts

import AuthController from "./authController";
import prismaClient from "@/services/prismaService";
import * as argon from "argon2";
import {
  generateToken,
  isValidToken,
  verifyToken,
} from "@/services/jwtService";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";

import { NextApiRequest, NextApiResponse } from "next";

jest.mock("@/services/prismaService", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock("argon2", () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("@/services/jwtService", () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  isValidToken: jest.fn(),
}));

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));
const mockRes = {
  status: mockStatus,
  json: mockJson,
} as unknown as NextApiResponse;

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user and return token", async () => {
      (argon.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (prismaClient.user.create as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });
      (generateToken as jest.Mock).mockReturnValue("token123");

      const req = {
        body: {
          email: "test@example.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        },
      } as unknown as NextApiRequest;

      await AuthController.register(req, mockRes);

      expect(prismaClient.user.create).toHaveBeenCalled();
      expect(generateToken).toHaveBeenCalledWith("123");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        id: "123",
        token: "token123",
        user: {
          id: "123",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      });
    });

    it("should handle duplicate email error", async () => {
      (argon.hash as jest.Mock).mockResolvedValue("hashed");
      (prismaClient.user.create as jest.Mock).mockRejectedValue(
        new PrismaClientKnownRequestError("error", {
          clientVersion: "1.0",
          code: "P2002",
        })
      );

      const req = {
        body: {
          email: "test@example.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        },
      } as unknown as NextApiRequest;

      await AuthController.register(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User with this email already exists",
        id: "",
      });
    });

    it("should handle generic errors", async () => {
      (argon.hash as jest.Mock).mockResolvedValue("hashed");
      (prismaClient.user.create as jest.Mock).mockRejectedValue(
        new Error("Something went wrong")
      );

      const req = {
        body: {
          email: "test@example.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        },
      } as unknown as NextApiRequest;

      await AuthController.register(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Something went wrong",
        id: "",
      });
    });
  });

  describe("login", () => {
    it("should return token for valid credentials", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
        hash: "hashedpassword",
      });
      (argon.verify as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("token123");

      const req = {
        body: { email: "test@example.com", password: "password" },
      } as unknown as NextApiRequest;

      await AuthController.login(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ id: "123", token: "token123" });
    });

    it("should return 400 for non-existent user", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      const req = {
        body: { email: "no@user.com", password: "password" },
      } as unknown as NextApiRequest;

      await AuthController.login(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid email or password",
        id: "",
      });
    });

    it("should return 400 for invalid password", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        hash: "hashedpassword",
      });
      (argon.verify as jest.Mock).mockResolvedValue(false);

      const req = {
        body: { email: "test@example.com", password: "wrong" },
      } as unknown as NextApiRequest;

      await AuthController.login(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid email or password",
        id: "",
      });
    });
  });

  describe("isAuthenticated", () => {
    it("should call next if token is valid", async () => {
      (verifyToken as jest.Mock).mockResolvedValue({
        exp: 9999999999,
        iat: 1,
        id: "123",
      });
      (isValidToken as jest.Mock).mockReturnValue(true);
      const next = jest.fn();

      const req = {
        headers: { authorization: "Bearer validtoken" },
      } as unknown as NextApiRequest;

      await AuthController.isAuthenticated(req, mockRes, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if token is missing", async () => {
      const req = {
        headers: {},
      } as unknown as NextApiRequest;

      await AuthController.isAuthenticated(req, mockRes, jest.fn());

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: "Not authorized" });
    });

    it("should return 401 if token is invalid", async () => {
      (verifyToken as jest.Mock).mockResolvedValue(false);

      const req = {
        headers: { authorization: "Bearer invalid" },
      } as unknown as NextApiRequest;

      await AuthController.isAuthenticated(req, mockRes, jest.fn());

      expect(mockStatus).toHaveBeenCalledWith(401);
    });
  });

  describe("getUserFromToken", () => {
    it("should return user if token is valid", async () => {
      (verifyToken as jest.Mock).mockResolvedValue({
        id: "123",
        exp: 9999999999,
        iat: 1,
      });
      (isValidToken as jest.Mock).mockReturnValue(true);
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });

      const req = {
        headers: { authorization: "Bearer validtoken" },
      } as unknown as NextApiRequest;

      await AuthController.getUserFromToken(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        id: "123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });
    });

    it("should return 404 if user not found", async () => {
      (verifyToken as jest.Mock).mockResolvedValue({
        id: "123",
        exp: 9999999999,
        iat: 1,
      });
      (isValidToken as jest.Mock).mockReturnValue(true);
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      const req = {
        headers: { authorization: "Bearer validtoken" },
      } as unknown as NextApiRequest;

      await AuthController.getUserFromToken(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 401 for invalid token", async () => {
      (verifyToken as jest.Mock).mockResolvedValue(null);

      const req = {
        headers: { authorization: "Bearer invalidtoken" },
      } as unknown as NextApiRequest;

      await AuthController.getUserFromToken(req, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: "Not authorized" });
    });
  });
});
