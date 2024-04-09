import { type ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

function Card(props: Props) {
  const { className, children, onClick } = props;
  return (
    <div
      className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
