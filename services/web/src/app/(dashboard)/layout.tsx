import '@/app/globals.css';
import ReactQueryProvider from '@/app/provider/ReactQueryProvider';
import NavbarModule from '@/components/navbar/navbar.module';
import SidebarModule from '@/components/sidebar/sidebar.module';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex">
          <SidebarModule />
          <div className="flex-col w-full h-screen">
            <NavbarModule />
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
