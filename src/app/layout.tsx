
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
import React, { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";
import "@/style/loading.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs"

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

    const connectAndSubscribe = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = Stomp.over(socket);
      console.log('connect socket');
      
      stompClient.connect({}, () => {
          console.log('Connected to WebSocket server');
          
          // Đăng ký để nhận tin nhắn từ máy chủ
          stompClient.subscribe('/chat', (message) => {
              console.log('Received message:', message.body);
              // Xử lý tin nhắn nhận được ở đây
          });
      }, (error) => {
          console.error('Error connecting to WebSocket server:', error);
      });
    };
    connectAndSubscribe();
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
                      <BodyWrapper>{children}</BodyWrapper>
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
