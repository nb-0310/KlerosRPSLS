import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick?: (event: any) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  className,
  ...attributes
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white disabled:bg-opacity-20 disabled:text-white/60 disabled:cursor-not-allowed text-[#3164fa] text-base py-2 px-4 rounded-lg ${className}`}
      {...attributes}
    >
      {children}
    </button>
  );
};

export default Button;
