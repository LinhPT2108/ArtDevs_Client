import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";

export default function IconTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs
      sx={{
        display: { xs: "none", md: "flex" },
        marginLeft: { md: "6px", lg: "24px" },
      }}
      value={value}
      onChange={handleChange}
      aria-label="icon tabs example"
    >
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
        }}
        className="rounded-full "
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
        }}
        className=" rounded-full"
        icon={<FavoriteIcon />}
        aria-label="favorite"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
        }}
        className=" rounded-full"
        icon={<PersonPinIcon />}
        aria-label="person"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          color: "white",
        }}
        className=" rounded-full"
        icon={<FavoriteIcon />}
        aria-label="favorite"
      />
    </Tabs>
  );
}
