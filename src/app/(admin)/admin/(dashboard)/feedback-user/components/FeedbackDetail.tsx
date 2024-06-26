import { formatDateString } from "@/components/utils/utils";
import { Avatar, Box, CardContent, CardHeader } from "@mui/material";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import ImageViewer2 from "react-simple-image-viewer";
interface props {
  feedback: FeedbackDTO;
}
const FeedbackDetail: React.FC<props> = ({ feedback }: props) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [listStringImg, setListStringImg] = useState<string[]>([]);
  const openImageViewer = useCallback((index: any, item: FeedbackDTO) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
    // Đảm bảo item.listImage không phải là undefined trước khi ánh xạ
    setListStringImg(item?.listImage?.map((i) => i.imageOfFeedbackUrl) || []);
    console.log(item);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
    setListStringImg([]);
  };
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
        title={feedback?.title}
        subheader={formatDateString(feedback?.createFeedback)}
      />

      <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Nội dung phản hồi:
        </div>
        <div className="text-xl text-navy-600 dark:text-white">
          {feedback?.content}
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
            feedback?.listImage?.length == 1 ? "1fr" : "1fr 1fr"
          }`,
          gridColumnGap: `${
            feedback?.listImage && feedback.listImage.length > 1 ? "3px" : "0"
          }`,
        }}
      >
        {feedback?.listImage && feedback.listImage.length < 3 ? (
          feedback?.listImage?.map((item, index) => (
            <Box
              onClick={() => openImageViewer(index, feedback)}
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
              <img
                src={item.imageOfFeedbackUrl}
                alt="photo"
                onClick={() => openImageViewer(index, feedback)}
              />
            </Box>
          ))
        ) : feedback?.listImage?.length == 3 ? (
          <React.Fragment key={feedback.id}>
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
              <img
                src={feedback?.listImage[0].imageOfFeedbackUrl}
                alt="photo"
              />
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
                      <ImageViewer2
                        src={listStringImg}
                        currentIndex={currentImage}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={closeImageViewer}
                      />
                    </Box>
                  )}
            </Box>
            <Box>
              {feedback?.listImage?.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? (
                    <Box
                      onClick={() => openImageViewer(index, feedback)}
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
        ) : feedback?.listImage?.length == 4 ? (
          feedback?.listImage?.map((item, index) => (
            <Box
              onClick={() => openImageViewer(index, feedback)}
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
          feedback?.listImage?.map((i, index) => (
            <React.Fragment key={index}>
              {index < 3 ? (
                <Box
                  onClick={() => openImageViewer(index, feedback)}
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
                      onClick={() => openImageViewer(index, feedback)}
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
                        {feedback?.listImage && feedback.listImage.length - 4}
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
export default FeedbackDetail;
