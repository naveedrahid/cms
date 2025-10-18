import { Inter } from "next/font/google";
import { Toaster } from 'sonner'
import "@/styles/globals.css";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </div>
      </body>
    </html>
  );
}