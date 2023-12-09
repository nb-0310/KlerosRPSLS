import { GameState } from '@/types';

const getGameStatusText = (gameState: GameState) => {
  const {
    hasPlayer2Moved,
    hasPlayer1Revealed,
    hasGameTimedOut,
    canPlayer1ClaimStake,
    canPlayer2ClaimStake,
    hasPlayer1ClaimedStake,
    hasPlayer2ClaimedStake,
  } = gameState;

  if (!hasGameTimedOut && !hasPlayer2Moved) {
    return 'Waiting for Player2 to make his move...';
  } else if (!hasGameTimedOut && hasPlayer2Moved && !hasPlayer1Revealed) {
    return 'Waiting for player1 to reveal his move...';
  } else if (canPlayer1ClaimStake) {
    return 'Time up. Player 1 can claim stake.';
  } else if (canPlayer2ClaimStake) {
    return 'Time up. Player 2 can claim stake.';
  } else if (hasPlayer1ClaimedStake) {
    return 'Game Timed Out';
  } else if (hasPlayer2ClaimedStake) {
    return 'Game Timed Out. Player 2 has claimed stake.';
  } else if (hasPlayer2Moved && hasPlayer1Revealed) {
    return 'Game Complete';
  }
};

export default getGameStatusText;
