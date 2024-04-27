// Icon Imports
import {
  MdBarChart,
  MdHome,
  MdOutlineShoppingCart,
  MdReport,
} from "react-icons/md";

const routes = [
  {
    name: "Bảng điều khiển",
    layout: "/dashboard",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: "Phản hồi người dùng",
    layout: "/dashboard",
    path: "feedback-user",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Hashtag & ngôn ngữ lập trình",
    layout: "/dashboard",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
  },
  {
    name: "Báo cáo của người dùng",
    layout: "/report",
    path: "report",
    icon: <MdReport className="h-6 w-6" />,
  },
];

export default routes;
