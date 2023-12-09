import React from 'react';
import Loader from '../Loader';

const Loading: React.FC = () => {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center space-y-8 pt-20">
      <Loader className="h-8 w-8" />
    </div>
  );
};

export default Loading;
