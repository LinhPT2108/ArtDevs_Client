"use client";
import { Grid, Rating } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CubeSpan } from "../utils/component.global";
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import useSWR, { SWRResponse } from "swr";
import { formatVND } from "../utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { GLOBAL_URL } from "../utils/veriable.global";

interface IPros {
  user: User;
}
const DetailMentor = ({ user }: IPros) => {
  var path = usePathname();
  const mentorCode = Array.isArray(path)
    ? path[0].split("/")[2]
    : path.split("/")[2];
  const fetchData = async (url: string) => {
    return await sendRequest<MentorInfor>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${user?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<MentorInfor, any> = useSWR(
    `${GLOBAL_URL}/api/mentor/${mentorCode}`,
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  console.log(data);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "100px",
          height: "86vh",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="cube-loader">
            <div className="cube-top"></div>
            <div className="cube-wrapper">
              {[0, 1, 2, 3].map((index) => (
                <CubeSpan key={index} index={index} />
              ))}
            </div>
          </div>
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ flexGrow: 1, marginTop: "24px" }}>
      <Grid
        container
        columns={12}
        spacing={2}
        sx={{
          "& .MuiGrid-item": {
            padding: { xs: "0 0 16px 16px", md: "0 0 0 16px" },
          },
        }}
      >
        {data && data.firstName}
      </Grid>
    </Box>
  );
};
export default DetailMentor;
