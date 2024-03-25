import AppSearch from "@/components/search/app.search";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { useRouter } from "next/router";
const Search = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1}}>{session && <AppSearch session={session} />}</Box>
  );
};
export default Search;
