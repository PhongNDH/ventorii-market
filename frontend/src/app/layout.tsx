import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/custom.scss';
import { ConfigProvider } from 'antd';
import StoreProvider from '@/context/store';
import Layout from '@/Layouts';
import { StarknetProvider } from '@/context/StarknetProvider';

export const metadata: Metadata = {
  title: 'Ventorii',
  description: 'Ventorii - NFT Marketplace',
};

const SpaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${SpaceMono.variable} font-mono`}>
        <StarknetProvider>
          <StoreProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#00C089',
                },
              }}
            >
              <Layout>
                {children}
                {/* Google Analytics */}
                {/* <GoogleAnalytics gaId='G-5JCE19WNL6' /> */}
              </Layout>
            </ConfigProvider>
          </StoreProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
