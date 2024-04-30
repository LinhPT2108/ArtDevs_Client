import { type Metadata } from "next";
import Banner from "./components/Banner";
import HistoryCard from "./components/HistoryCard";
import TopCreatorTable from "../dashboard/components/table/TableTopCreators";
import NftCard from "@/components/admin/card/NftCard";

import tableDataTopCreators from "./variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "./variables/tableColumnsTopCreators";
import FeddbackTable from "./components/FeddbackTable";
import {
  columnsFeedbackTable,
  columnsHashtagTable,
} from "../data-tables/variables/columnsData";
import UpgradeTable from "./components/UpgradeTable";

export const metadata: Metadata = {
  title: "NFT | Horizon UI by Ories",
};

const NFTMarketPlacePage = () => {
  // const bidders = [
  //   "/img/avatars/avatar1.png",
  //   "/img/avatars/avatar2.png",
  //   "/img/avatars/avatar3.png",
  // ];

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-1">
      {/* right side section */}
      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-3">
        <FeddbackTable columnsData={columnsFeedbackTable} />
      </div>
      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-3">
        <UpgradeTable columnsData={columnsFeedbackTable} />
      </div>
    </div>
  );
};

export default NFTMarketPlacePage;
