"user client";
import { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";

const SearchComponent = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const handleFocus = () => {
    if (svgRef.current) {
      svgRef.current.classList.add("animate");
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (svgRef.current) {
      svgRef.current.classList.remove("animate");
    }
    setIsFocused(false);
  };

  const handleSearch = () => {
    console.log(">>> check data search: ", search);
  };

  return (
    <div className="bg-white flex rounded-2xl shadow-md min-[0px]:hidden min-[600px]:flex">
      <input
        type="search"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Start typing to start..."
        className="focus:rounded-r-none focus:rounded-l-2xl text-search text-black rounded-2xl px-4 py-2 p-right-5 input-search focus:outline-none min-[600px]:w-36 min-[700px]:w-48 min-[800px]:w-52 min-[1023px]:w-56"
      />
      {/* {(isFocused || (!isFocused && search)) && ( */}
      <Button
        className={`w-10 h-10 rounded-l-none rounded-r-2xl bg-slate-200 hover:bg-slate-300`}
        onClick={() => handleSearch()}
      >
        <SearchIcon />
      </Button>
      {/* )} */}
    </div>
  );
};

export default SearchComponent;
