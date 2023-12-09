'use client';

import React from 'react';
import { useContractReads } from 'wagmi';

import RPSAbi from '@/contracts/RPS.json';
import GameLoading from '@/components/game/GameLoading';
import GameDisplay from '@/components/game/GameDisplay';

const GamePage = ({ params }: { params: { contractAddress: string } }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const gameContract: {
    address: `0x${string}`;
    abi: any;
  } = {
    address: params.contractAddress as `0x${string}`,
    abi: RPSAbi,
  };

  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
    contracts: [
      {
        ...gameContract,
        functionName: 'stake',
      },
      {
        ...gameContract,
        functionName: 'j1',
      },
      {
        ...gameContract,
        functionName: 'j2',
      },
      {
        ...gameContract,
        functionName: 'c1Hash',
      },
      {
        ...gameContract,
        functionName: 'c2',
      },
      {
        ...gameContract,
        functionName: 'TIMEOUT',
      },
      {
        ...gameContract,
        functionName: 'lastAction',
      },
    ],
  });

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full h-full">
      {isLoading && <GameLoading />}
      {isError && (
        <h1 className="text-red-500">
          There was an error loading the game. Please try again!
        </h1>
      )}
      {isSuccess && data && (
        <GameDisplay
          gameData={data}
          gameContract={params.contractAddress as `0x${string}`}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default GamePage;
