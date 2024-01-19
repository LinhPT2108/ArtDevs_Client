import { CardMedia, Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
const FooterAbout = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container sx={{ color: "#ffffff" }}>
        <Grid container columns={2} sx={{ padding: "48px 0" }}>
          <Grid item xs={2} md={1}>
            <Box sx={{ fontWeight: 700, paddingY: "12px" }}>Managed by</Box>
            <Box sx={{ display: "flex" }}>
              <CardMedia
                sx={{
                  borderRadius: "8px",
                  width: "80px",
                }}
                component="img"
                image="/Art_Devs_y-removebg-preview.png"
                alt="Art_Devs_y-removebg-preview.png"
              />
              <Box sx={{ marginLeft: "12px", fontWeight: 700, fontSize: 24 }}>
                ART DEVS <br />
                FOUNDATION
              </Box>
            </Box>
            <Box sx={{ paddingY: "36px", color: "#848895" }}>
              © 2024 Art Devs Foundation. All rights reserved.
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            md={1}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Box>
              <Box sx={{ fontWeight: 700 }}>ART DEVS</Box>
              <Box sx={{ paddingY: "16px", color: "#848895" }}>
                <Box sx={{ margin: "12px 0" }}>Media Kit</Box>
                <Box sx={{ margin: "12px 0" }}>Mentor</Box>
                <Box sx={{ margin: "12px 0" }}>Share NewFeeds</Box>
                <Box sx={{ margin: "12px 0" }}>Denied</Box>
                <Box sx={{ margin: "12px 0" }}>Chat</Box>
                <Box sx={{ margin: "12px 0" }}>Privacy Policy</Box>
              </Box>
            </Box>
            <Box>
              <Box sx={{ fontWeight: 700 }}>GET CONNECTED</Box>
              <Box sx={{ paddingY: "16px", color: "#848895" }}>
                <Box sx={{ margin: "12px 0" }}>Post</Box>
                <Box sx={{ margin: "12px 0" }}>Comment</Box>
                <Box sx={{ margin: "12px 0" }}>Add Friend</Box>
                <Box sx={{ margin: "12px 0" }}>Blog Profile</Box>
              </Box>
            </Box>
            <Box sx={{ fontWeight: 700 }}>VI</Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default FooterAbout;
