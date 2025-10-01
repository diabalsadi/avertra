import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    accessToken?: string;
    firstName?: string;
    lastName?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    firstName?: string;
    lastName?: string;
  }
}
