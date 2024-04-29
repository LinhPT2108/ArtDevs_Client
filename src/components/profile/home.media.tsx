import { Box, ImageList, Tabs, Typography } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IPros {
  session: User;
}
const HomeMedia = ({ session }: IPros) => {
  const fetchDataAvatar = async (url: string) => {
    return await sendRequest<ImageofPost[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const {
    data: avatars,
    error: errorAvatar,
    isLoading: isLoadingAvatar,
    mutate: mutateAvatar,
  }: SWRResponse<ImageofPost[], any> = useSWR(
    GLOBAL_URL + "/api/picture/true",
    fetchDataAvatar,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const fetchDataBG = async (url: string) => {
    return await sendRequest<ImageofPost[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const {
    data: backgrounds,
    error: errorBG,
    isLoading: isLoadingBG,
    mutate: mutateBG,
  }: SWRResponse<ImageofPost[], any> = useSWR(
    GLOBAL_URL + "/api/picture/false",
    fetchDataBG,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Ảnh đại diện" {...a11yProps(0)} />
          <Tab label="Ảnh nền" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ImageList>
          <ImageListItem key="Subheader" cols={6}></ImageListItem>
          {avatars &&
            avatars.map((item) => (
              <ImageListItem
                sx={{ "& img": { border: "1px solid #80808080" } }}
                key={item.cloudinaryPublicId}
              >
                <img
                  srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                  alt={item.imageUrl}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
        </ImageList>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ImageList>
          <ImageListItem key="Subheader" cols={6}></ImageListItem>
          {backgrounds &&
            backgrounds.map((item) => (
              <ImageListItem
                sx={{ "& img": { border: "1px solid #80808080" } }}
                key={item.cloudinaryPublicId}
              >
                <img
                  srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                  alt={item.imageUrl}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
        </ImageList>
      </CustomTabPanel>
    </Box>
  );
};
export default HomeMedia;
