import { UserProvider } from "@/lib/custom.content";
import ThemeProvider from "@/providers/ThemeProvider";
import "@/style/admin.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
