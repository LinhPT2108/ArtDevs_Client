import { formatDateString } from "@/components/utils/utils";
import { Avatar, Box, CardHeader } from "@mui/material";
import Link from "next/link";
import React from "react";
interface props {
  item: Post;
}
const PostDetail: React.FC<props> = ({ item }: props) => {
  return (
    <Box>
      <CardHeader
        sx={{
          color: "#000000",
        }}
        avatar={
          <Avatar
            aria-label="recipe"
            alt="Profile Picture"
            src={item?.userPost?.profilePicUrl}
          ></Avatar>
        }
        title={item?.userPost?.fullname}
        subheader={formatDateString(item?.time)}
      />
      <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
        {item?.content}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          paddingX: "16px",
          paddingBottom: "16px",
          "& a": {
            backgroundColor: "#d6e8fa",
            color: "#0c3b6a",
            borderRadius: "4px",
            fontSize: "12px",
            // fontWeight: "400",
            padding: "4.8px 6px",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            margin: "0 2px 2px 0",
            border: "1px solid #BDC0C7",
            textDecoration: "none",
            gridArea: "auto",
            "&:hover": {
              transform: "translateY(-1px) translateX(0)",
              boxShadow: "0 1px 0 0 #BDC0C7",
            },
          },
        }}
      >
        {item?.listHashtag?.map((hashtag) => (
          <Link key={hashtag.id} href="/">
            {hashtag?.hashtagDetailName}
          </Link>
        ))}
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
            item?.listImageofPost?.length == 1 ? "1fr" : "1fr 1fr"
          }`,
          gridColumnGap: `${item?.listImageofPost?.length > 1 ? "3px" : "0"}`,
        }}
      >
        {item?.listImageofPost?.length < 3 ? (
          item?.listImageofPost?.map((item, index) => (
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
              <img src={item.imageUrl} alt="photo" />
            </Box>
          ))
        ) : item?.listImageofPost?.length == 3 ? (
          <React.Fragment key={item.postId}>
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
              <img src={item?.listImageofPost[0].imageUrl} alt="photo" />
            </Box>
            <Box>
              {item?.listImageofPost?.map((item, index) => (
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
                      <img src={item?.imageUrl} alt="photo" />
                    </Box>
                  ) : (
                    <React.Fragment key={index}></React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </React.Fragment>
        ) : item?.listImageofPost?.length == 4 ? (
          item?.listImageofPost?.map((item, index) => (
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
              <img src={item.imageUrl} alt="photo" />
            </Box>
          ))
        ) : (
          item?.listImageofPost?.map((i, index) => (
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
                  <img src={i.imageUrl} alt="photo" />
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
                      <img src={i.imageUrl} alt="photo" />
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
                        {item?.listImageofPost?.length - 4}
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
export default PostDetail;
