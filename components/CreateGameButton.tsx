'use client';

import ConnectWalletButton from '@/components/ConnectWalletButton';
import Link from 'next/link';
import { sepolia, useAccount, useNetwork } from 'wagmi';
import SwitchNetworkButton from './SwitchNetworkButton';

const CreateGameButton = () => {
  const { isConnected } = useAccount();

  const { chain } = useNetwork();

  let button;

  if (isConnected) {
    if (chain?.id !== sepolia.id) {
      button = <SwitchNetworkButton />;
    } else {
      button = (
        <Link
          href="/create"
          className="bg-white text-blue-700 text-base py-2 px-4 rounded-lg"
        >
          Create Game
        </Link>
      );
    }
  } else {
    button = <ConnectWalletButton />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {button}
    </div>
  );
};
export default CreateGameButton;
