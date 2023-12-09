import React from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import abi from '@/contracts/abi.json';
import Loader from '../Loader';
import { moves } from '@/utils/moves';
import getTimeLeft from '@/utils/getTimeLeft';
import ExplorerLink from '../ExplorerLink';
import ContractCallButton from '../ContractCallButton';
import { GameState } from '@/types';

type Player2 = {
  gameContract: `0x${string}`;
  player2Move: number;
  timeout: number;
  lastAction: number;
  gameState: GameState;
  refetch: () => void;
  stake: bigint;
  player1: string;
};

const Player2: React.FC<Player2> = ({
  gameContract,
  player2Move,
  timeout,
  lastAction,
  gameState,
  refetch,
  stake,
  player1,
}) => {
  const {
    hasPlayer1ClaimedStake,
    hasPlayer1Revealed,
    hasPlayer2Moved,
    canPlayer2ClaimStake,
  } = gameState;

  console.log(gameState);

  const [move, setMove] = React.useState<number>();
  const [showLoader, setShowLoader] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(
    getTimeLeft(timeout, lastAction)
  );

  const [waitForPlayTxHash, setWaitForPlayTxHash] =
    React.useState<`0x${string}`>();

  const { data: waitForPlayTxData } = useWaitForTransaction({
    hash: waitForPlayTxHash,
    confirmations: 1,
  });

  const [waitForClaimTxHash, setWaitForClaimTxHash] =
    React.useState<`0x${string}`>();

  const { data: waitForClaimTxData } = useWaitForTransaction({
    hash: waitForClaimTxHash,
    confirmations: 1,
  });

  const { config } = usePrepareContractWrite({
    address: move ? gameContract : undefined,
    abi,
    functionName: 'play',
    args: [move],
    value: stake,
    onError(error) {
      alert((error.cause as any)?.shortMessage ?? error.message);
      setShowLoader(false);
    },
  });
  const { write } = useContractWrite({
    ...config,
    onSettled(data, error) {
      if (error) {
        alert((error.cause as any)?.shortMessage ?? error.message);
        setShowLoader(false);
        return;
      }
      setWaitForPlayTxHash(data?.hash);
    },
  });
  
  const { config: claimStakeConfig } = usePrepareContractWrite({
    address: gameState.canPlayer2ClaimStake ? gameContract : undefined,
    abi,
    functionName: 'j1Timeout',
    onError(error) {
      alert((error.cause as any)?.shortMessage ?? error.message);
      setShowLoader(false);
    },
  });

  const { write: claimStake } = useContractWrite({
    ...claimStakeConfig,
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
    if (waitForPlayTxData || waitForClaimTxData) {
      refetch();
      setShowLoader(false);
    }
  }, [waitForPlayTxData, refetch, waitForClaimTxData]);

  React.useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft(timeout, lastAction));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, timeout, lastAction]);

  const handleSubmit = React.useCallback(async () => {
    setShowLoader(true);
    await write?.();
  }, [write]);

  const handleClaimStake = React.useCallback(async () => {
    setShowLoader(true);
    await claimStake?.();
  }, [claimStake]);

  return (
    <div className="my-8 flex flex-col justify-between space-y-4">
      <div>
        <span className="font-semibold">Your Opponent: </span>
        <p>
          <ExplorerLink hashOrAddress={player1} isAddress></ExplorerLink>
        </p>
      </div>

      <div>
        <span className="font-semibold">Opponent&apos;s move: </span>
        <span className="text-blue-700 bg-white px-2 py-1 rounded-lg mx-2 font-semibold">
          {hasPlayer1Revealed
            ? 'Player 1 has revealed their move'
            : 'Yet to be revealed'}
        </span>
      </div>
      {!hasPlayer2Moved && (
        <div>
          <span>Time left for player 2: </span>
          <p className='text-red-800 font-semibold'>
            {timeLeft > 0 ? (
              `${Math.floor(timeLeft / 1000 / 60)}:${
                Math.floor(timeLeft / 1000) % 60
              }`
            ) : (
              <div className="py-2">
                <span className="text-blue-700 bg-white px-2 py-1 rounded-lg font-semibold">
                  Time&apos;s up!
                </span>
              </div>
            )}
          </p>
        </div>
      )}
      {hasPlayer2Moved && !hasPlayer1Revealed && (
        <div>
          <span>Time left for player 1 to reveal move: </span>
          <span className='text-red-800 font-semibold'>
            {timeLeft > 0 ? (
              `${Math.floor(timeLeft / 1000 / 60)}:${
                Math.floor(timeLeft / 1000) % 60
              }`
            ) : (
              <div className="inline-flex items-center space-x-4">
                <span>Time is up!</span>
                {canPlayer2ClaimStake && (
                  <ContractCallButton
                    disabled={!canPlayer2ClaimStake || showLoader}
                    onClick={handleClaimStake}
                  >
                    {showLoader ? <Loader /> : 'Claim Stake'}
                  </ContractCallButton>
                )}
              </div>
            )}
          </span>
          {hasPlayer2Moved && !hasPlayer1Revealed && timeLeft <= 0 && (
            <p className="text-xs w-full">
              (please refresh if you don&apos;t see the button to claim stake)
            </p>
          )}
        </div>
      )}
      {!hasPlayer1ClaimedStake && (
        <div>
          {!hasPlayer2Moved ? (
            <>
              <div>
                <div className="flex">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs">Move:</label>
                    <select
                      name="move"
                      id="move"
                      value={move}
                      onChange={(e) => setMove(Number(e.target.value))}
                      className="rounded"
                    >
                      <option value="" disabled>
                        Select a move
                      </option>
                      {moves.map((move, idx) => (
                        <option key={move} value={idx + 1}>
                          {move}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <ContractCallButton
                onClick={() => handleSubmit()}
                className="mt-3"
                disabled={showLoader}
              >
                {showLoader ? <Loader /> : 'Submit Move'}
              </ContractCallButton>
            </>
          ) : (
            <>
              <span className='font-semibold'>Your move: </span>
              <span className="text-blue-700 bg-white px-2 py-1 rounded-lg mx-2 font-semibold">
                {moves[player2Move - 1]}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Player2;
