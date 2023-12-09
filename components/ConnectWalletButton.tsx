'use client';

import { useAccount, useConnect, useBalance, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Button from './Button';

const ConnectWalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { chain } = useNetwork();

  const { data, isError, isLoading } = useBalance({
    address,
  });

  return (
    <div className='flex items-center gap-3'>
      {address && (
        <div className='text-white text-xl font-semibold py-2 px-4 rounded-xl'>{chain?.name}</div>
      )}
      <div>
        {isConnected ? (
          <div className="flex items-center border-2 border-white rounded-xl gap-2 pl-2">
            <div className="font-bold">
              {data?.formatted.slice(0, 3) + ' ' + data?.symbol}
            </div>
            <Button>{address?.substring(0, 6)}...{address?.slice(address?.length - 5, address?.length)}</Button>
          </div>
        ) : (
          <Button onClick={() => connect()}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
};

export default ConnectWalletButton;
