import { Box, CardMedia } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import { isImage } from "../utils/utils";

interface CustomPagingProps {
  imageUrls: ImageofPost[];
}

const CustomPaging: React.FC<CustomPagingProps> = ({ imageUrls }) => {
  const settings = {
    customPaging: function (i: number) {
      return (
        <a>
          <img src={imageUrls[i].imageUrl} alt={`Image ${i + 1}`} />{" "}
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
              component={
                isImage(item.imageUrl) === "image"
                  ? "img"
                  : isImage(item.imageUrl) === "video"
                  ? "video"
                  : "div"
              }
              controls={isImage(item.imageUrl) === "video"}
              image={item?.imageUrl}
              alt={item?.postID}
            />
            <img src={item.imageUrl} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default CustomPaging;
