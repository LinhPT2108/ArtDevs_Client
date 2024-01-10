import { Box } from "@mui/material";
import React from "react";
import MenuAccept from "./right-menu/menu.accept";
import MenuMentor from "./right-menu/menu.mentor";

const RightPost = () => {
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
