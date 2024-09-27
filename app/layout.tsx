import type { Metadata } from "next";
import "./globals.css";
import type { Viewport } from 'next'
import { League_Spartan } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";


const spartan = League_Spartan({ 
  subsets: ["latin"],
  weight: ['300', "400", '500', '600', '700'],
  variable: '--font-sans'
});



export const metadata: Metadata = {
  title: "E-Medical Center",
  description: "A healthcare management system by Nanino",
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  userScalable: false,

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen bg-dark-300 font-sans antialiased', spartan.variable)}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
        {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
