import { sendRequest } from "@/components/utils/api";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateUniqueId } from "@/components/utils/utils";
import {
  GLOBAL_URL,
  getGlobalUser,
  setGlobalUser,
} from "@/components/utils/veriable.global";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "..." },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await sendRequest<IBackendRes<UserLogin>>({
          url: GLOBAL_URL + "/api/login",
          method: "POST",
          body: {
            email: credentials?.username,
            password: credentials?.password,
          },
        });
        if (res?.userdto) {
          //@ts-ignore
          setGlobalUser(res);
          return res as any;
        } else {
          //@ts-ignore
          throw new Error(res?.error as string);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (trigger === "signIn" && account?.provider !== "credentials") {
        const res = await sendRequest<IBackendRes<UserLogin>>({
          url: GLOBAL_URL + "/api/user-social",
          method: "POST",
          body: {
            lastName: "",
            middleName: "",
            firstName: "",
            email: `${token?.email}`,
            password: "",
            dateOfBirth: "",
            provider: `${account?.provider}`,
            profilePicUrl: ``,
            city: "",
            district: "",
            ward: "",
            role: { id: 2, roleName: "user" },
            userId: generateUniqueId(),
            username: `${token?.name}`,
            isOnline: false,
            listDemandOfUser: [],
            listSkillOfUser: [],
          },
        });
        if (res.userdto) {
          // if (!res.userdto.profileImageUrl && token.picture) {
          //   res.userdto.profileImageUrl = token.picture;
          // }
          token.access_token = res.token;
          token.refresh_token = res.refeshToken;
          token.user = res.userdto;

          //@ts-ignore
          setGlobalUser(res);
        }
      }
      if (trigger === "signIn" && account?.provider === "credentials") {
        //@ts-ignore
        token.access_token = user.token;
        //@ts-ignore
        token.refresh_token = user.refeshToken;
        //@ts-ignore
        token.user = user.userdto;
        //@ts-ignore
        setGlobalUser(user);
      }
      if (trigger === "update") {
        token = session;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
