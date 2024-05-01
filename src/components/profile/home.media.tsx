import { Box, Grid, ImageList, Tabs, Typography } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";
import Tab from "@mui/material/Tab";
import { useCallback, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
import ImageViewer from "react-simple-image-viewer";

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
  dataProfile: UserLogin | undefined;
}
const HomeMedia = ({ session, dataProfile }: IPros) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [listStringImg, setListStringImg] = useState<string[]>([]);
  const openImageViewer = useCallback((index: any, item: ImageofPost[]) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
    console.log(index);
    setListStringImg(item?.map((i) => i.imageUrl));
    console.log(item);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
    setListStringImg([]);
  };

  const fetchDataAvatar = async (url: string) => {
    return await sendRequest<ImageofPost[]>({
      url: url,
      method: "GET",
      // headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const {
    data: avatars,
    error: errorAvatar,
    isLoading: isLoadingAvatar,
    mutate: mutateAvatar,
  }: SWRResponse<ImageofPost[], any> = useSWR(
    GLOBAL_URL + `/api/picture/true/${dataProfile?.userId}`,
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
    GLOBAL_URL + `/api/picture/false/${dataProfile?.userId}`,
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
      {isViewerOpen && (
        <Box
          sx={{
            "& .react-simple-image-viewer__modal": {
              zIndex: 999999,
              "& img": {
                width: "auto",
              },
            },
          }}
        >
          <ImageViewer
            src={listStringImg}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        </Box>
      )}
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
        <Grid container columns={12} spacing={2}>
          {avatars &&
            avatars.map((item, index) => (
              <Grid
                item
                xs={3}
                sx={{ "& img": { border: "1px solid #80808080" } }}
                key={item.cloudinaryPublicId}
                onClick={() => openImageViewer(index, avatars)}
              >
                <img
                  srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                  alt={item.imageUrl}
                  loading="lazy"
                  width={"100%"}
                  height={"100%"}
                />
              </Grid>
            ))}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container columns={12} spacing={2}>
          {backgrounds &&
            backgrounds.map((item, index) => (
              <Grid
                item
                xs={3}
                sx={{ "& img": { border: "1px solid #80808080" } }}
                key={item.cloudinaryPublicId}
                onClick={() => openImageViewer(index, backgrounds)}
              >
                <img
                  srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                  alt={item.imageUrl}
                  loading="lazy"
                  width={"100%"}
                  height={"100%"}
                />
              </Grid>
            ))}
        </Grid>
      </CustomTabPanel>
    </Box>
  );
};
export default HomeMedia;
