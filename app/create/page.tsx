'use client';
import React from 'react';
import {
  sepolia,
  useAccount,
  useNetwork,
  useWalletClient,
  useBalance,
} from 'wagmi';
import { encodePacked, formatEther, keccak256, parseEther, toHex } from 'viem';

import Button from '@/components/Button';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import abi from '@/contracts/abi.json';
import bytecode from '@/contracts/bytecode';
import SwitchNetworkButton from '@/components/SwitchNetworkButton';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { moves } from '@/utils/moves';
import generateSalt from '@/utils/generateSalt';

function CreatePage() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const router = useRouter();

  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();

  const { data, isError, isLoading } = useBalance({
    address,
  });

  const labelClassName = 'mb-1';
  const inputClassName =
    'text-black text-sm rounded border border-[#c5c5c5] font-normal p-1 focus:border[#c5c5c5] focus:border focus:outline-none w-full';
  const radioLabelClassName =
    'border border-gray-500 rounded-lg p-2 text-sm peer-checked:bg-white peer-checked:text-black cursor-pointer';
  const selectClassName = 'text-gray-400 border border-[#c5c5c5] p-1 rounded focus:border[#c5c5c5] focus:border focus:outline-none';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const player2 = formData.get('player2');
    const stake = formData.get('stake');
    const move = formData.get('move');

    const salt = generateSalt(16);

    if (!stake || !player2 || !move) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (stake && Number(stake) <= 0) {
      alert('Stake must be greater than 0');
      setIsSubmitting(false);
      return;
    }

    if (data?.formatted && stake > data?.formatted) {
      alert('Stake amount cannot be greater than your balance');
      setIsSubmitting(false);
      return;
    }

    if (address === player2) {
      alert('Player 2 cannot be the same as Player 1');
      setIsSubmitting(false);
      return;
    }

    const moveIndex = moves.indexOf(move?.toString() ?? '');

    const hash = keccak256(
      encodePacked(['uint8', 'uint256'], [moveIndex + 1, BigInt(salt)])
    );

    const txHash = await walletClient?.deployContract({
      abi,
      account: address,
      args: [hash, player2],
      bytecode,
      value: parseEther(stake?.toString() ?? '0'),
      chain: sepolia,
    });

    localStorage.setItem(
      `waiting-room-${txHash}`,
      JSON.stringify({ salt: BigInt(salt).toString(), move: moveIndex })
    );

    router.push(`/waiting-room/${txHash}`);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col pt-20 items-center justify-center h-[70vh]">
        <h1 className="text-xl font-semibold mb-1">
          Connect wallet to continue
        </h1>
        <ConnectWalletButton />
      </div>
    );
  }

  if (chain?.id !== sepolia.id) {
    return (
      <div className="flex flex-col pt-20 items-center justify-center h-[70vh]">
        <h1 className="text-xl font-semibold mb-1">
          Switch Network to continue
        </h1>
        <SwitchNetworkButton />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4 bg-white rounded-xl py-3 px-5 w-[350px] mx-auto mt-20 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10"
    >
      <div>
        <h1 className="text-lg font-semibold">Create Game</h1>
        <p className="text-xs">Stake some ETH and challenge your friends!</p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Opponent&apos;s Address:</label>
        <input
          className={inputClassName}
          type="text"
          name="player2"
          id="player2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Stake:</label>
        <input
          className={inputClassName}
          type="number"
          step="any"
          min={formatEther(BigInt(1))}
          max={1}
          name="stake"
          id="stake"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Move:</label>
        <select
          className={selectClassName}
          name="move"
          id="move"
          defaultValue=""
        >
          <option value="" disabled>
            Select a move
          </option>
          {moves.map((move) => (
            <option key={move} value={move}>
              {move}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isSubmitting} className='bg-white disabled:bg-opacity-20 disabled:text-white/60 disabled:cursor-not-allowed text-blue-700 text-base py-2 px-4 rounded-lg'>
        {isSubmitting ? <Loader /> : 'Start Game'}
      </button>
    </form>
  );
}

export default CreatePage;
