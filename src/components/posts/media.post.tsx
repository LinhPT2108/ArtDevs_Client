import { Box, CardMedia } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import { isImage } from "../utils/utils";

interface CustomPagingProps {
  imageUrls: ImageofPost[]; // Mảng chứa đường dẫn các hình ảnh từ Cloudinary
}

const CustomPaging: React.FC<CustomPagingProps> = ({ imageUrls }) => {
  const settings = {
    customPaging: function (i: number) {
      return (
        <a>
          <img src={imageUrls[i].imageUrl} alt={`Image ${i + 1}`} />{" "}
          {/* Sử dụng imageUrls[i] để lấy đường dẫn */}
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box className="slider-container">
      <Slider {...settings}>
        {imageUrls.map((item, index) => (
          <div key={index}>
            <CardMedia
              key={item.id}
              component={
                isImage(item.imageUrl) === "image"
                  ? "img"
                  : isImage(item.imageUrl) === "video"
                  ? "video"
                  : "div"
              }
              // autoPlay={isImage(item.imageUrl) === "video"}
              controls={isImage(item.imageUrl) === "video"}
              image={item?.imageUrl}
              alt={item?.postID}
              //   sx={{
              //     objectFit: "cover",
              //     maxWidth: "100%",
              //     width: `${imageUrls?.length > 1 ? "100%" : "100%"}`,
              //   }}
            />
            <img src={item.imageUrl} alt={`Image ${index + 1}`} />{" "}
            {/* Sử dụng imageUrl để lấy đường dẫn */}
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default CustomPaging;
