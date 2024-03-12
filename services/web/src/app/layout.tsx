import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@root/provider/ReactQueryProvider';
import StyleProvider from '@root/provider/StyleProvider';

const inter = Inter({ subsets: ['latin'] });

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyleProvider font={inter}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </StyleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
