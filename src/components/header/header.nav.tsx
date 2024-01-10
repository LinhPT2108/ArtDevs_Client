import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";

const IconTabs = (pros: any) => {
  const [value, setValue] = React.useState<number>(pros?.tabValue);

  React.useEffect(() => {
    setValue(pros?.tabValue);
  }, [pros?.tabValue]);

  return (
    <Tabs
      sx={{
        display: { xs: "none", md: "flex" },
        marginLeft: { md: "6px", lg: "24px" },
        "& .MuiButtonBase-root": {
          backgroundColor: "#d5d8db2e",
        },
        "& .Mui-selected": {
          backgroundColor: "#2d679785",
          transition: "all 0.3s ease-in",
          boxShadow: " 0px 0px 0px 1px rgba(0, 0, 0, 0.2)",
        },
        "& .MuiTabs-indicator": {
          display: "none",
        },
      }}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        pros.handleChangeTab(newValue);
      }}
      aria-label="icon tabs example"
    >
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
          borderRadius: "100%",
        }}
        color=""
        icon={<PhoneIcon />}
        aria-label="phone"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
          borderRadius: "100%",
        }}
        icon={<FavoriteIcon />}
        aria-label="favorite"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
          borderRadius: "100%",
        }}
        icon={<PersonPinIcon />}
        aria-label="person"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
          borderRadius: "100%",
        }}
        icon={<FavoriteIcon />}
        aria-label="favorite"
      />
    </Tabs>
  );
};
export default IconTabs;
