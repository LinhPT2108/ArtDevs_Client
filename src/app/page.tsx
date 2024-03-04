import About from "@/components/about/app.about";
import RightPost from "@/components/left-menu/app.right.menu";
import PostProfile from "@/components/profile/post.profile";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);
  let firstName = session?.user?.firstName ? session?.user?.firstName : "";
  let middleName = session?.user?.middleName ? session?.user?.middleName : "";
  let lastName = session?.user?.lastName ? session?.user?.lastName : "";
  let fullname = firstName + " " + middleName + " " + lastName;
  if (session) {
    return (
      <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
        <Box
          sx={{
            marginTop: "12px",
            padding: { xs: "0 24px", md: "0 0 0 0" },
          }}
        >
          <Box>
            <Box
              sx={{
                borderRadius: "5px",
                boxShadow: "0px 1px 2px #3335",
                backgroundColor: "#fff",
                padding: "10px",
                marginBottom: "15px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  // justifyContent:'center',
                  alignItems: "center",
                  borderBottom: "1px solid #3333",
                  paddingBottom: "10px",
                }}
              >
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    marginRight: "12px",
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      cursor: "pointer",
                    },
                  }}
                >
                  <a href="#">
                    <img
                      src={`${
                        session?.user?.profilePicUrl
                          ? session?.user?.profilePicUrl
                          : "/profile/user.jpg"
                      }`}
                    />
                  </a>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    padding: "7px 10px",
                    height: "36px",
                    boxSizing: "border-box",
                    borderRadius: "25px",
                    backgroundColor: "#E4E6EB",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#D8DADF",
                    },
                  }}
                >
                  <Typography
                    component={"span"}
                    sx={{
                      position: "absolute",
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "15px",
                      color: "#333",
                    }}
                  >
                    What&apos;s on your mind?
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  padding: "10px 0px 0px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                    maxWidth: "160px",
                    padding: "5px",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    filter: "drop-shadow(0 0 0.1rem crimson)",
                    marginRight: "8px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#E4E6EB",
                    },
                  }}
                >
                  <Typography
                    component={"p"}
                    sx={{
                      padding: "5px 0px",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#333",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <VideoFileIcon sx={{ color: "#E42645" }} />
                    <Typography component={"span"} sx={{ marginLeft: "6px" }}>
                      Video
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "50%",
                    padding: "5px",
                    maxWidth: "160px",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    filter: "drop-shadow(0 0 0.1rem green)",
                    borderRadius: "20px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#E4E6EB",
                    },
                  }}
                >
                  <Typography
                    component={"p"}
                    sx={{
                      padding: "5px 0px",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#333",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AddAPhotoIcon sx={{ color: "#41B35D" }} />
                    <Typography component={"span"} sx={{ marginLeft: "6px" }}>
                      Photo
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
            <PostProfile session={session} fullname={fullname} />
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            padding: "0 0 0 12px",
            justifyContent: "flex-start",
            maxWidth: "250px",
            minWidth: "210px",
          }}
        >
          <RightPost />
        </Box>
      </Box>
    );
  }
  return <About />;
}
