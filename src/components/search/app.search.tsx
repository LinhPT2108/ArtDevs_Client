import Box from "@mui/material/Box";

interface IPros {
  session: User;
}

const AppSearch = ({ session }: IPros) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      Đây là trang tìm kiếm của {session?.user?.email}
    </Box>
  );
};
export default AppSearch;
