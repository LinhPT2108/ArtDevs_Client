import Card from "@/components/admin/card";
import CardMenu from "@/components/admin/card/CardMenu";
import { ReactNode } from "react";
import {
  BsCloudCheck,
  BsExclamationOctagonFill,
  BsFillChatSquareTextFill,
} from "react-icons/bs";
interface StorageProps {
  total: number;
  title: string;
  description: string;
  icon: ReactNode; // hoặc có thể sử dụng kiểu IconType từ 'react-icons'
  onClick?: () => void; // Định nghĩa prop onClick
}
const Storage = ({ total, title, description, icon,onClick }: StorageProps) => {
  return (
    <Card className={"w-full h-full p-4"} onClick={onClick}>
      {/* Your storage */}
      <div className="absolute top-0 left-0 bg-red-400 text-white rounded-lg p-2">
        {/* Your numeric value */}
        <div className="absolute top-0 left-0 bg-red-500 text-white rounded-lg p-2 flex items-center">
          <span className="text-lg font-bold  mr-1">{total}</span>
          {/* Icon */}
          <BsFillChatSquareTextFill className="text-lg" />

          {/* Total */}
        </div>
      </div>
      <div className="mb-auto flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[26px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
          {icon}
        </div>
        <h4 className="mb-px mt-3 text-2xl font-bold text-navy-700 dark:text-white">
          {title}
        </h4>
        <p className="px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default Storage;
