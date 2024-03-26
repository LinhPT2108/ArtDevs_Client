import { type Metadata } from "next";
import "./globals.css";
import "@/components/admin/calendar/MiniCalendar.css";
import ThemeProvider from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Art Devs Socail",
  description: "Devs",
  applicationName: "ArtDevs",
  keywords: [
    "react",
    "server components",
    "nextjs",
    "tailwind",
    "admin",
    "dashboard",
  ],
  themeColor: "#422AFB",
  icons: [
    // { rel: "icon", type: 'image/svg', url: "/map/location.svg" },
    { rel: "apple-touch-icon", type: "image/png", url: "/img/horizon.png" },
  ],
  generator: "ArtDevs",
  authors: [{ name: "ArtDevs", url: "http://localhost:3000" }],
  creator: "ArtDevs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
