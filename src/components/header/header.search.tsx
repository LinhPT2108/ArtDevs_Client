"user client";
import { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputBase } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SearchComponent = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

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
    router.push(`/search?keyword=${search}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        borderRadius: "16px",
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "@media (min-width: 600px)": {
          display: "flex",
        },
        "@media (max-width: 599px)": {
          display: "none",
        },
      }}
    >
      <InputBase
        type="search"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Tìm kiếm..."
        sx={{
          color: "black",
          borderRadius: "16px",
          padding: "4px 16px",
          paddingRight: "5",
          "@media (min-width: 600px)": {
            width: "144px",
          },
          "@media (min-width: 700px)": {
            width: "192px",
          },
          "@media (min-width: 1023px)": {
            width: "224px",
          },
          "& input": {
            "&:focus": {
              outline: "none",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderTopLeftRadius: "16PX",
              borderBottomLeftRadius: "16px",
            },
            "@media (min-width: 600px)": {
              width: "144px",
            },
            "@media (min-width: 700px)": {
              width: "192px",
            },
            "@media (min-width: 1023px)": {
              width: "224px",
            },
          },
        }}
      />
      <Button
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "0",
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
          backgroundColor: "#bdbdbd",
          color: "#0277bd",
          border: "none",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            outline: "none",
            border: "none",
          },
        }}
        onClick={handleSearch}
      >
        <SearchIcon />
      </Button>
      {/* )} */}
    </Box>
  );
};

export default SearchComponent;
