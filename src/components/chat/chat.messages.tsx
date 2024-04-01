import { Box, CardMedia, Stack, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { checkUrl, checkUrl2, formatDateString, isImage } from "../utils/utils";
import { useEffect, useRef } from "react";

interface IPros {
  preViewImage: boolean;
  pageUrl: string;
  dataMessage: MessageContent[] | null;
  session: User;
}
const Messsages = (pros: IPros) => {
  const { preViewImage, pageUrl, dataMessage, session } = pros;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(dataMessage?.length);

    if (dataMessage?.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      console.log("scroll");
    }
  }, [dataMessage?.length]);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    console.log("scroll1");
  }, []);

  if (!dataMessage) {
    return (
      <Box
        sx={{
          margin: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: `${
            pageUrl === "home"
              ? !preViewImage
                ? "274px"
                : "200px"
              : !preViewImage
              ? "88%"
              : "79%"
          }`,
          overflow: "auto",
          "::-webkit-scrollbar": {
            width: "5px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#4CAF50",
            borderRadius: "4px",
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        margin: "0",
        height: `${
          pageUrl === "home"
            ? !preViewImage
              ? "274px"
              : "200px"
            : !preViewImage
            ? "88%"
            : "79%"
        }`,
        overflowY: "auto",
        "::-webkit-scrollbar": {
          width: "5px",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#4CAF50",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        maxWidth: "100%",
      }}
    >
      {dataMessage?.map((_e: MessageContent, _index: number) => {
        return (
          <Box
            key={`message-${_index}`}
            sx={{
              width: "100%",
            }}
          >
            {_e.formUserId != session?.user.userId ? (
              <Box
                className="messsage-content-formUser"
                sx={{
                  display: "flex",
                  margin: "6px",
                }}
              >
                <Tooltip
                  title={formatDateString(_e.timeMessage)}
                  placement="left"
                  arrow
                >
                  <Stack justifyContent="center" alignItems="flex-start">
                    <Box
                      sx={{
                        backgroundColor: "orange",
                        borderRadius: "30px 30px 30px 0",
                        color: "black",
                        maxWidth: "100%",
                        padding: "10px 20px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        width: "fit-content",
                      }}
                    >
                      {_e.content}
                    </Box>
                    <Box sx={{ display: "flex",mt:"8px" }}>
                      {_e.pictureOfMessages.length > 0 &&
                        _e.pictureOfMessages.map((p, index) => {
                          return (
                            <Box key={p.cloudinaryPublicId} mx={"4px"}>
                              <CardMedia
                                component={
                                  isImage(p.url) === "image"
                                    ? "img"
                                    : isImage(p.url) === "video"
                                    ? "video"
                                    : "div"
                                }
                                // autoPlay={isImage(p.url) === "video"}
                                controls={isImage(p.url) === "video"}
                                image={p?.url}
                                alt={p?.postID}
                                sx={{
                                  objectFit: "cover",
                                  maxWidth: "100%",
                                  width:
                                    isImage(p.url) === "image"
                                      ? "100px"
                                      : "200px",
                                  borderRadius: "16px",
                                }}
                              />
                            </Box>
                          );
                        })}
                    </Box>
                  </Stack>
                </Tooltip>
              </Box>
            ) : (
              <Box
                className="message-content-logged"
                sx={{
                  display: "flex",
                  margin: "6px",
                  justifyContent: "flex-end",
                }}
              >
                <Tooltip
                  title={formatDateString(_e.timeMessage)}
                  placement="left"
                >
                  <Stack
                    sx={{
                      maxWidth: "100%",
                    }}
                    justifyContent="center"
                    alignItems="flex-end"
                  >
                    <Box
                      sx={{
                        backgroundColor: "aqua",
                        borderRadius: "30px 30px 0 30px",
                        color: "black",
                        padding: "10px 20px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        width: "fit-content",
                        float: "right",
                      }}
                    >
                      {_e.content}
                    </Box>
                    <Box
                      sx={{
                        float: "right",
                        mt: 1,
                        display: "flex",
                      }}
                    >
                      {_e.pictureOfMessages.length > 0 &&
                        _e.pictureOfMessages.map((p, index) => {
                          const imageUrl = checkUrl2(p);
                          // console.log(imageUrl);
                          if (p instanceof File) {
                            return (
                              <Box key={"picofMess" + index} mx={"4px"}>
                                <img
                                  src={imageUrl}
                                  alt={`Preview ${index}`}
                                  style={{
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    width: "100px",
                                    objectFit: "cover",
                                    maxWidth: "100%",
                                    borderRadius: "16px",
                                  }}
                                />
                              </Box>
                            );
                          }
                          return (
                            <Box key={p.cloudinaryPublicId + index} mx={"4px"}>
                              <CardMedia
                                component={
                                  isImage(p.url) === "image"
                                    ? "img"
                                    : isImage(p.url) === "video"
                                    ? "video"
                                    : "img"
                                }
                                // autoPlay={isImage(imageUrl.split("blob:")) === "video"}
                                controls={isImage(p.url) === "video"}
                                image={p.url}
                                alt={p?.postID}
                                sx={{
                                  objectFit: "cover",
                                  maxWidth: "100%",
                                  width:
                                    isImage(p.url) === "image"
                                      ? "100px"
                                      : "200px",
                                  borderRadius: "16px",
                                }}
                              />
                            </Box>
                          );
                        })}
                    </Box>
                  </Stack>
                </Tooltip>
              </Box>
            )}
            <div ref={ref} />
          </Box>
        );
      })}
    </Box>
  );
};

export default Messsages;
