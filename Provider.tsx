'use client';

import { WagmiConfig } from 'wagmi';

import config from '@/index';

const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

export default Provider;
