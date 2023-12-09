import React from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { moves } from '@/utils/moves';
import RPSAbi from '@/contracts/RPS.json';
import Loader from '../Loader';
import { GameState } from '@/types';
import getTimeLeft from '@/utils/getTimeLeft';
import ContractCallButton from '../ContractCallButton';
import ExplorerLink from '../ExplorerLink';

type Player1 = {
  gameContract: `0x${string}`;
  player2Move: number;
  timeout: number;
  lastAction: number;
  gameState: GameState;
  refetch: () => void;
  player2: string;
};

const Player1: React.FC<Player1> = ({
  gameContract,
  player2Move,
  timeout,
  lastAction,
  gameState,
  refetch,
  player2
}) => {
  const {
    hasGameTimedOut,
    hasPlayer2Moved,
    hasPlayer2ClaimedStake,
    hasPlayer1Revealed,
    canPlayer1ClaimStake,
  } = gameState;

  const [showLoader, setShowLoader] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(
    getTimeLeft(timeout, lastAction)
  );

  const [waitForSolveTxHash, setWaitForSolveTxHash] =
    React.useState<`0x${string}`>();

  const { data: waitForSolveTxData } = useWaitForTransaction({
    hash: waitForSolveTxHash,
    confirmations: 1,
  });

  const [waitForClaimTxHash, setWaitForClaimTxHash] =
    React.useState<`0x${string}`>();

  const { data: waitForClaimTxData } = useWaitForTransaction({
    hash: waitForClaimTxHash,
    confirmations: 1,
  });

  const getPlayer1Move = React.useCallback(() => {
    const gameData = localStorage.getItem(`game-${gameContract}`);
    if (gameData) {
      const parsedGameData = JSON.parse(gameData);
      return moves[parsedGameData.move];
    }
    return null;
  }, [gameContract]);

  const getPlayer1Salt = React.useCallback(() => {
    const gameData = localStorage.getItem(`game-${gameContract}`);
    if (gameData) {
      const parsedGameData = JSON.parse(gameData);
      return parsedGameData.salt;
    }
    return null;
  }, [gameContract]);

  // reveal move contract call
  const { config: revealMoveConfig } = usePrepareContractWrite({
    address: gameState.hasPlayer2Moved ? gameContract : undefined,
    abi: RPSAbi,
    functionName: 'solve',
    args: [
      moves.indexOf(getPlayer1Move() as string) + 1,
      BigInt(getPlayer1Salt()),
    ],
    onError(error) {
      alert((error.cause as any)?.shortMessage ?? error.message);
      setShowLoader(false);
    },
  });

  const { write: revealMove } = useContractWrite({
    ...revealMoveConfig,
    onSettled(data, error) {
      if (error) {
        alert((error.cause as any)?.shortMessage ?? error.message);
        setShowLoader(false);
        return;
      }
      setWaitForSolveTxHash(data?.hash);
    },
  });

  // claim stake contract call
  const { config } = usePrepareContractWrite({
    address: gameState.canPlayer1ClaimStake ? gameContract : undefined,
    abi: RPSAbi,
    functionName: 'j2Timeout',
    onError(error) {
      alert((error.cause as any)?.shortMessage ?? error.message);
      setShowLoader(false);
    },
  });

  const { write: claimStake } = useContractWrite({
    ...config,
    onSettled(data, error) {
      if (error) {
        alert((error.cause as any)?.shortMessage ?? error.message);
        setShowLoader(false);
        return;
      }
      setWaitForClaimTxHash(data?.hash);
    },
  });

  React.useEffect(() => {
    if (waitForSolveTxData || waitForClaimTxData) {
      refetch();
      setShowLoader(false);
    }
  }, [waitForSolveTxData, refetch, waitForClaimTxData]);

  React.useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft(timeout, lastAction));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, timeout, lastAction]);

  const handleClaimStake = React.useCallback(async () => {
    setShowLoader(true);
    await claimStake?.();
  }, [claimStake]);

  const handleRevealMove = React.useCallback(async () => {
    setShowLoader(true);
    await revealMove?.();
  }, [revealMove]);

  return (
    <div className="mt-4 flex flex-col justify-between space-y-4">
      <div>
        <span className='font-semibold'>Your Opponent: </span>
        <p><ExplorerLink hashOrAddress={player2} isAddress></ExplorerLink></p>
      </div>

      <div>
        <span className='font-semibold'>Your move: </span>
        <span className='text-blue-700 bg-white px-2 py-1 rounded-lg mx-2 font-semibold'>{getPlayer1Move()}</span>
      </div>
      {(!hasGameTimedOut || hasPlayer1Revealed) && (
        <div>
          <span className="font-semibold">Opponent&apos;s move: </span>
          <span className='text-blue-700 bg-white px-2 py-1 rounded-lg mx-2 font-semibold'>
            {Boolean(player2Move)
              ? moves[player2Move - 1]
              : 'Waiting for player 2 to move'}
          </span>
        </div>
      )}

      {!hasPlayer2Moved && (
        <div>
          <span>Time left for opponent: </span>
          <span className='text-red-800 font-semibold'>
            {timeLeft > 0 ? (
              `${Math.floor(timeLeft / 1000 / 60)}:${
                Math.floor(timeLeft / 1000) % 60
              }`
            ) : (
              <div className="inline-flex items-center space-x-4">
                <span>Time is up!</span>
                {canPlayer1ClaimStake && (
                  <ContractCallButton
                    disabled={!canPlayer1ClaimStake || showLoader}
                    onClick={handleClaimStake}
                  >
                    {showLoader ? <Loader /> : 'Claim Stake'}
                  </ContractCallButton>
                )}
              </div>
            )}
          </span>
          {!hasPlayer2Moved && timeLeft <= 0 && (
            <p>
              (please refresh if you don&apos;t see the button to claim stake)
            </p>
          )}
        </div>
      )}
      {hasPlayer2Moved && !hasPlayer1Revealed && (
        <>
          <div>
            <span>Time left to reveal: </span>
            <span className='text-red-800 font-semibold'>
              {timeLeft > 0 ? (
                `${Math.floor(timeLeft / 1000 / 60)}:${
                  Math.floor(timeLeft / 1000) % 60
                }`
              ) : (
                <div className="inline-flex items-center space-x-4">
                  <span>
                    Time is up!{' '}
                    {hasPlayer2ClaimedStake
                      ? 'Player 2 has reclaimed stake'
                      : 'But you can still reveal your move'}
                  </span>
                </div>
              )}
            </span>
          </div>
          {!hasPlayer2ClaimedStake && (
            <div>
              <ContractCallButton
                onClick={() => handleRevealMove()}
                className="mx-auto"
                disabled={showLoader}
              >
                {showLoader ? <Loader /> : 'Reveal Move'}
              </ContractCallButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Player1;
