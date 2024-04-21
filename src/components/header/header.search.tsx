import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchComponent() {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSearch = () => {
    router.push(`/search?keyword=${search}`);
  };
  useEffect(() => {
    searchParams.get("keyword") &&
      setSearch(searchParams.get("keyword") as string);
  }, [searchParams.get("keyword") as string]);
  return (
    <Paper
      // component="form"
      sx={{
        p: "2px 12px",
        margin: "0 12px",
        display: "flex",
        backgroundColor: "#eeeeee",
        borderRadius: "30px",
        alignItems: "center",
        "@media (min-width: 600px)": {
          width: "144px",
        },
        "@media (min-width: 700px)": {
          width: "240px",
        },
        "@media (min-width: 1023px)": {
          width: "300px",
        },
      }}
    >
      <InputBase
        value={search}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        sx={{
          ml: 1,
          flex: 1,
        }}
        placeholder="Tìm kiếm"
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
