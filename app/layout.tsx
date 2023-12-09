import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';
import WagmiProvider from '@/wagmi/Provider';
import Navbar from '@/components/layout/Navbar';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Rock Paper Scissors Lizard Spock',
  description: 'Play Rock Paper Scissors Lizard Spock game on the blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-gradient-to-tr from-blue-50 to-blue-600 h-screen w-full text-white`}
      >
        <WagmiProvider>
          <Navbar />
          <main>{children}</main>
        </WagmiProvider>
      </body>
    </html>
  );
}
