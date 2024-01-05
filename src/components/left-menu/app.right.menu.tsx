import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import "@/style/left-menu.css";
import "@/style/right-menu.css";
import MenuAccept from "./right-menu/menu.accept";
import MenuMentor from "./right-menu/menu.mentor";

const RightPost = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
      }}
    >
      <MenuAccept />
      <MenuMentor />
    </Box>
  );
};

export default RightPost;
