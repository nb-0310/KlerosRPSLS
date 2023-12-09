import React from 'react';
import Loader from '../Loader';

const GameLoading: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-8 pt-20">
      <Loader className="h-8 w-8" />
    </div>
  );
};

export default GameLoading;
