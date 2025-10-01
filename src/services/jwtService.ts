import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = async (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const isValidToken = (token: {
  exp: number;
  iat: number;
  id: string;
}) => {
  if (!token) return false;

  const { exp, iat, id } = token;

  if (!exp || !iat || !id) return false;

  const isExpired = Date.now() >= exp * 1000;
  return !isExpired;
};

