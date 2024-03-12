import { Inter } from 'next/font/google';
import '@/app/globals.css';
import ReactQueryProvider from '@/app/provider/ReactQueryProvider';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: 'red' }}>
        <div className="flex">
          <div className="flex-1">
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
