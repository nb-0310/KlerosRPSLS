'use client';

import Button from '@/components/Button';
import ExplorerLink from '@/components/ExplorerLink';
import Loader from '@/components/Loader';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useWaitForTransaction } from 'wagmi';

const WaitingPage = ({ params }: { params: { txHash: string } }) => {
  const [showGameLink, setShowGameLink] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [hash, setHash] = useState<`0x${string}`>(
    params.txHash as `0x${string}`
  );

  console.log(hash);

  const { data, isSuccess, isLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: hash,
    onReplaced(response) {
      setHash(response.replacedTransaction.hash);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const gameInMemory = localStorage.getItem(
        `waiting-room-${params.txHash}`
      );

      if (gameInMemory) {
        localStorage.setItem(`game-${data?.contractAddress}`, gameInMemory);
        localStorage.removeItem(`waiting-room-${params.txHash}`);
      }
      setShowGameLink(true);
    }
  }, [isSuccess, data, params.txHash]);

  // skip server side rendering to avoid hydration errors
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] w-full gap-2 pt-20">
        <h2 className="">
          Please Wait...
        </h2>
        <Loader />
      </div>
    );
  } else if (isSuccess && data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] w-full space-y-8 py-20">
        {showGameLink && (
          <Link href={`/game/${data?.contractAddress}`}>
            <Button>Play Game</Button>
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-8 py-20">
      <h2 className="text-xl font-bold italic">
        Could not find the transaction. Please check and try again!
      </h2>
    </div>
  );
};

export default WaitingPage;
