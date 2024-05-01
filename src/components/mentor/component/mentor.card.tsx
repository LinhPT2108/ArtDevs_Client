"use client";

import { sendRequest } from "@/components/utils/api";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import useSWR, { SWRResponse } from "swr";
import { usePathname, useRouter } from "next/navigation";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_MENU,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
import React, { useEffect, useRef, useState } from "react";
import { TransitionProps } from "react-transition-group/Transition";
import { CubeSpan } from "@/components/utils/component.global";
import Image from "next/image";

interface MyCard {
  handleRedirect: (id: string) => void;
  handleClickOpen: (
    mentorName: string,
    userId: string,
    isReady: boolean
  ) => void;
  data: MentorInfor;
}

const CardMentor = ({
  handleRedirect,
  handleClickOpen,
  data: mentor,
}: MyCard) => {
  //test
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (isVisible) {
      console.log(">>> check data mentor: ", mentor);
    }
  }, [isVisible]);
  return (
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        padding: "0px",
      }}
    >
      <Card
        ref={elementRef}
        sx={{
          background:
            "linear-gradient(180deg, rgba(103, 186, 186) 0%, rgba(45, 53, 102) 100%)",
          border: "40px radius",
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out",
          cursor: "pointer",
          margin: "15px",
          borderRadius: "12px",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            width: "100px",
            height: "150px",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundSize: "cover",
            backgroundImage: 'url("/background_card_image.png")',
            backgroundRepeat: "no-repeat",
            zIndex: 1,
          },
        }}
      >
        <Grid
          container
          xs={12}
          sx={{
            paddingBottom: "12px",
          }}
        >
          <Grid item xs={5} sx={{ position: "relative" }}>
            <Box
              sx={{
                top: "30px",
                left: "30px",
                backgroundColor: mentor?.online ? "#16D6B5" : "#e60839",
                border: "1px solid white",
                borderRadius: "12px",
                padding: "2px 6px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
              }}
            >
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: mentor?.online ? "#f5f5f5" : "#f5f5f5",
                  marginRight: "4px",
                }}
              ></Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "white",
                }}
              >
                {mentor?.online ? "Online" : "Offline"}
              </Typography>
            </Box>
            <CardMedia
              component="img"
              alt="green iguana"
              height="220"
              image={mentor.profilePicUrl || "/OIP.jpg"}
              onClick={() => {
                handleRedirect(mentor?.userId);
              }}
              sx={{
                borderRadius: "8px",
                objectFit: "cover",
                margin: "24px",
                border: "1px solid gray",
                maxWidth: "200px",
              }}
            />

            <Typography
              gutterBottom
              component="div"
              padding="5px 5px 3px 20px"
              textAlign="left"
              sx={{
                fontSize: "24px",
                fontWeight: "500",
                fontStyle: "bold",

                color: "white",
              }}
              onClick={() => {
                handleRedirect(mentor?.userId);
              }}
            >
              {mentor.fullname}
            </Typography>
          </Grid>
          <Grid
            item
            xs={7}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              gutterBottom
              component="div"
              textAlign="center"
              sx={{
                fontSize: "28px",
                fontWeight: "500",
                fontStyle: "bold",
                color: "white",
                marginTop: "14px",
              }}
            >
              Kỹ năng
            </Typography>
            <CardContent sx={{ flexGrow: 1, paddingY: "0px" }}>
              <Box display="flex" flexWrap="wrap">
                {mentor?.listSkillOfMentor?.map((skill, index) => (
                  <React.Fragment key={`skill${index}`}>
                    {index < 6 && (
                      <Box
                        marginRight="5px"
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          backgroundColor: "#f5f5f5",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          // flexGrow: 1,
                          minWidth: "168px",
                          marginY: "4px",
                        }}
                      >
                        <Image
                          width={30}
                          height={30}
                          src={`/language-program/${
                            skill == "C#"
                              ? "C_other"
                              : skill == "C++"
                              ? "C_Plus"
                              : skill
                          }.png`}
                          alt={`${skill == "C#" ? "C_other.png" : skill}.png`}
                        />
                        <Box
                          sx={{
                            width: "auto",
                            textDecoration: "none",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: GLOBAL_COLOR_MENU,
                            fontSize: 18,
                            marginLeft: "8px",
                          }}
                        >
                          {skill}
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
              {mentor?.listSkillOfMentor.length >= 6 && (
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  .....
                </Typography>
              )}
            </CardContent>
            <CardActions
              sx={{
                justifyContent: "flex-end ",
                width: "100%",
                paddingRight: "20px",
              }}
            >
              <Button
                color="primary"
                variant="contained"
                sx={{
                  border: "5px ",
                  marginRight: "12px",
                  borderRadius: "30px",
                  padding: "8px 16px",
                  ":hover": {
                    boxShadow: GLOBAL_BOXSHADOW,
                  },
                }}
                onClick={() =>
                  handleClickOpen(
                    mentor?.fullname,
                    mentor.userId,
                    mentor.isReady
                  )
                }
              >
                Nhờ Hỗ Trợ
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
export default CardMentor;
