'use client';

import { sepolia, useAccount, useConnect, useSwitchNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Button from './Button';

const SwitchNetworkButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    onError: (error) => {
      alert("Please change the network in your wallet to 'Sepolia'");
    },
  });

  return (
    <div>
      <Button onClick={() => switchNetwork?.(sepolia.id)}>
        Switch to Sepolia
      </Button>
    </div>
  );
};

export default SwitchNetworkButton;
