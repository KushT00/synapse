// import {AIVoiceInput} from '@/components/ui/ai-voice-input'
import {ExpandableChatDemo} from '@/components/sidechatbot'
import './globals.css'
import { Inter } from 'next/font/google'
import { UserProvider } from '@/lib/UserContext'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Synapse - AI-Powered Learning Platform',
  description: 'An AI-powered learning platform with dyslexia-friendly features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..800;1,200..800&family=Geist:wght@100..900&family=Monomakh&display=swap');
          `}
        </style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark', 'colorblind');
                  if (theme !== 'light') {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          <UserProvider>
            {children}
          </UserProvider>
          <div className="fixed top-2 right-5 z-50">
            {/* <AIVoiceInput /> */}
          </div>
          <div className="fixed bottom-2 right-5 z-50">
            <ExpandableChatDemo />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
