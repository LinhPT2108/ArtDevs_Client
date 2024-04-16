"use client";
import { type Metadata } from "next";

import ColumnsTable from "./components/ColumnsTable";
import ComplexTable from "../report/table/ReportTable";

import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
  columnsHashtagTable,
  columnsProgramingLanguageTable,
} from "./variables/columnsData";
import tableDataDevelopment from "./variables/tableDataDevelopment.json";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataColumns from "./variables/tableDataColumns.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import HashtagTable from "./components/HashtagTable";
import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";

import { GLOBAL_URL } from "@/components/utils/veriable.global";
import { useState } from "react";
import ProgamingLanguageTable from "./components/ProgamingLanguageTable";
import DailyTraffic from "../dashboard/components/DailyTraffic";

const DataTablesPage = () => {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <HashtagTable columnsData={columnsHashtagTable} />
        <ProgamingLanguageTable columnsData={columnsProgramingLanguageTable} />
      </div>
    </div>
  );
};

export default DataTablesPage;
