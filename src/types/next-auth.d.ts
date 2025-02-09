// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name?: string;
      username?: string;
      email?: string;
      image?: string;
      isVerified?: boolean;
    };
  }

  interface User {
    _id: string;
    name?: string;
    username?: string;
    email?: string;
    image?: string;
    isVerified?: boolean;
  }
}
