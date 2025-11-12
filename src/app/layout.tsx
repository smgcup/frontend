import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/app/ThemeProvider";
export const metadata: Metadata = {
  title: "Smg Cup",
  description: "Smg Cup is a platform for creating and managing tournaments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar
            menu={[
              { title: "Home", url: "/" },
              {
                title: "Tournaments",
                url: "#",
              },
              {
                title: "About",
                url: "#",
              },
              {
                title: "Contact",
                url: "#",
              },
            ]}
            auth={{
              login: { title: "Login", url: "/login" },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
