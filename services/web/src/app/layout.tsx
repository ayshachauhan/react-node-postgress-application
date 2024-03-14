import ReduxProvider from '@root/provider/Redux';
import dynamic from 'next/dynamic';
import { Lato } from 'next/font/google';
import './globals.css';

const StyleProvider = dynamic(() => import('@root/provider/StyleProvider'), {
  ssr: false,
});

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'] });

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={lato.className}>
        <StyleProvider font={lato}>
          <ReduxProvider>{children}</ReduxProvider>
        </StyleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
