import Box from "@mui/material/Box";

interface IPros {
  session: User;
}
const HomeAbout = ({ session }: IPros) => {
  console.log(">>> check session: ", session);
  return <Box sx={{ flexGrow: 1 }}>Giới thiệu</Box>;
};
export default HomeAbout;
