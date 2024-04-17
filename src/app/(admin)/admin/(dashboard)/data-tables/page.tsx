"use client";

import HashtagTable from "./components/HashtagTable";
import {
  columnsHashtagTable,
  columnsProgramingLanguageTable,
} from "./variables/columnsData";

import ProgamingLanguageTable from "./components/ProgamingLanguageTable";

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
