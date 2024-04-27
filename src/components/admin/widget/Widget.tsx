import { FC, ReactNode } from "react";
import Card from "@/components/admin/card";
import { Badge } from "@mui/material";

type Props = {
  icon?: ReactNode | string;
  title?: string;
  subtitle?: string;
  newAccount?: number;
  onWidgetClick: () => void;
};

const Widget: FC<Props> = ({
  icon,
  title,
  subtitle,
  newAccount,
  onWidgetClick,
}) => {
  return (
    <Card
      className="!flex-row flex-grow items-center rounded-[20px]"
      onClick={onWidgetClick}
    >
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className="flex items-center text-brand-500 dark:text-white">
            <Badge
              color="error"
              badgeContent={newAccount}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              showZero
            >
              {icon}
            </Badge>
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {subtitle}
        </h4>
      </div>
    </Card>
  );
};

export default Widget;
