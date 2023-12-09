import { sepolia, useNetwork, useSwitchNetwork } from 'wagmi';
import Button from './Button';

type ContractCallButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

const ContractCallButton: React.FC<
  React.PropsWithChildren<ContractCallButtonProps>
> = ({ onClick, className, disabled, children }) => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    onSettled() {
      onClick();
    },
  });

  const handleClick = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (chain?.id !== sepolia.id) {
      await switchNetwork?.(sepolia.id);
    } else {
      onClick();
    }
  };
  return (
    <Button onClick={handleClick} className={className} disabled={disabled}>
      {children}
    </Button>
  );
};

export default ContractCallButton;
