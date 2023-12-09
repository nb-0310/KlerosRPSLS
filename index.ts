import { createConfig, sepolia, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
});

export { chains };

export default config;
