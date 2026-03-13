import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    backendUser?: {
      id: number;
      username: string;
      email: string;
      first_name?: string;
      last_name?: string;
      role?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    accessToken?: string;
    error?: string;
    user: DefaultSession["user"] & {
      id?: string;
      username?: string;
      role?: string;
      first_name?: string;
      last_name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: {
      id: number;
      username: string;
      email: string;
      first_name?: string;
      last_name?: string;
      role?: string;
    };
    error?: string;
  }
}
