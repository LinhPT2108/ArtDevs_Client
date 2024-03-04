import HeaderWrapper from "@/components/header/header.wrapper";
import BodyWrapper from "@/components/home/body.wrapper";
import {
  DrawerProvider,
  UserProvider,
  WidthScreenProvider,
} from "@/lib/custom.content";
import HomeWrapper from "@/lib/home.wrapper";
import NextAuthWrapper from "@/lib/next.auth.provider";
import theme from "@/theme.js";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";
import "@/style/loading.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: User | null = await getServerSession(authOptions);

  console.log("Children component:");
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>
            <DrawerProvider>
              <WidthScreenProvider>
                {session && (
                  <NextAuthWrapper>
                    <HeaderWrapper user={session} />
                    <HomeWrapper>
                      <BodyWrapper session={session}>{children}</BodyWrapper>
                    </HomeWrapper>
                  </NextAuthWrapper>
                )}
                {!session && children}
              </WidthScreenProvider>
            </DrawerProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
  // } else {
  //   return (
  //     <html lang="en">
  //       <body className={inter.className}>
  //         <ThemeProvider theme={theme}>
  //           <CssBaseline />
  //           <UserProvider>{children}</UserProvider>
  //         </ThemeProvider>
  //       </body>
  //     </html>
  //   );
  // }
}
