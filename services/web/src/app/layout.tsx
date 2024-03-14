import ReduxProvider from '@root/provider/Redux';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import './globals.css';

const StyleProvider = dynamic(() => import('@root/provider/StyleProvider'), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyleProvider font={inter}>
          <ReduxProvider>{children}</ReduxProvider>
        </StyleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
