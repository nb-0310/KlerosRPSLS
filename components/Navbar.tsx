import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-4 px-8 w-full">
      <Link href="/" className="text-2xl font-bold cursor-pointer">
        ETHERCLASH
      </Link>
      <ConnectWalletButton />
    </header>
  );
};

export default Navbar;
