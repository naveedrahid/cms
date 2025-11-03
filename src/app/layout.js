// import { Inter } from "next/font/google";
import { Toaster } from 'sonner'
import "@/styles/globals.css";

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   preload: false,
//   fallback: ['system-ui', 'arial'],
// })

export const metadata = {
  title: 'Your App',
  description: 'Your  app description',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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