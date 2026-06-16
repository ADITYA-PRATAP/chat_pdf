import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaperChat — Chat with any PDF",
  description:
    "Upload a PDF and get instant, sourced answers. Built for students, researchers, and professionals who'd rather ask than scroll.",
};

// Dark is the default theme; only an explicit "light" choice opts out.
// Applied before first paint to avoid a flash of the wrong color scheme.
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <ClerkProvider>
          <Providers>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                className:
                  "!bg-card !text-card-foreground !border !border-border !shadow-lg",
                style: { borderRadius: "0.75rem" },
                success: {
                  iconTheme: {
                    primary: "var(--primary)",
                    secondary: "var(--primary-foreground)",
                  },
                },
              }}
            />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
