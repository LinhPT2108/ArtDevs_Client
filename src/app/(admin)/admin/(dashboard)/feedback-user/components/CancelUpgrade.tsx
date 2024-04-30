import { formatDateString } from "@/components/utils/utils";
import { Avatar, Box, CardContent, CardHeader } from "@mui/material";
import Link from "next/link";
import React from "react";
interface props {
  item: FeedbackDTO;
}
const CancelUpgrade: React.FC<props> = ({ item }: props) => {
  return (
    <Box>
      <CardContent
        sx={{
          fontSize: "24px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Chi Tiết Phản Hồi
      </CardContent>
      <CardHeader
        sx={{
          color: "#000000",
        }}
        title={item?.title}
        subheader={formatDateString(item?.createFeedback)}
      />

      <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Nội dung phản hồi:
        </div>
        <div className="text-xl text-navy-600 dark:text-white">
          {item?.content}
        </div>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          color: "#fff",
          width: "100%",
          height: "auto",
          // height: `${
          //   item?.listImageofPost?.length > 1 ? "350px" : "auto"
          // }`,
          boxSizing: "border-box",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: `${
            item?.listImage?.length == 1 ? "1fr" : "1fr 1fr"
          }`,
          gridColumnGap: `${
            item?.listImage && item.listImage.length > 1 ? "3px" : "0"
          }`,
        }}
      >
        {item?.listImage && item.listImage.length < 3 ? (
          item?.listImage?.map((item, index) => (
            <Box
              key={index}
              sx={{
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                },
              }}
            >
              <img src={item.imageOfFeedbackUrl} alt="photo" />
            </Box>
          ))
        ) : item?.listImage?.length == 3 ? (
          <React.Fragment key={item.id}>
            <Box
              sx={{
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                },
              }}
            >
              <img src={item?.listImage[0].imageOfFeedbackUrl} alt="photo" />
            </Box>
            <Box>
              {item?.listImage?.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "50%",
                        backgroundColor: "#3335",
                        borderBottom: `${index == 1 ? "3px solid #fff" : "0"}`,
                        boxSizing: "border-box",
                        "& img": {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <img src={item?.imageOfFeedbackUrl} alt="photo" />
                    </Box>
                  ) : (
                    <React.Fragment key={index}></React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </React.Fragment>
        ) : item?.listImage?.length == 4 ? (
          item?.listImage?.map((item, index) => (
            <Box
              key={index}
              sx={{
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                },
              }}
            >
              <img src={item.imageOfFeedbackUrl} alt="photo" />
            </Box>
          ))
        ) : (
          item?.listImage?.map((i, index) => (
            <React.Fragment key={index}>
              {index < 3 ? (
                <Box
                  sx={{
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    },
                  }}
                >
                  <img src={i.imageOfFeedbackUrl} alt="photo" />
                </Box>
              ) : (
                <React.Fragment key={index}>
                  {index == 4 ? (
                    <Box
                      sx={{
                        position: "relative",
                        "& img": {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <img src={i.imageOfFeedbackUrl} alt="photo" />
                      <Box
                        sx={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                          backgroundColor: "#6d6868a3",
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                          boxSizing: "border-box",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {item?.listImage && item.listImage.length - 4}
                      </Box>
                    </Box>
                  ) : (
                    <React.Fragment key={index}></React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          ))
        )}
      </Box>
    </Box>
  );
};
export default CancelUpgrade;
