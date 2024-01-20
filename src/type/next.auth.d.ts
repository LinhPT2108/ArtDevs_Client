import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
interface IUsers {
  _id: string;
  username: string;
  email: string;
  isVerify: boolean;
  type: string;
  role: string;
  address: string;
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    user: IUsers;
  }
}
declare module "next-auth" {
  interface Session {
    user: IUsers;
    access_token: string;
    refresh_token: string;
    user: IUsers;
  }
}
