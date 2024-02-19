"use client";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
interface IPros {
  user: User | null;
}
const HomeMentor = (pros: IPros) => {
  const { user } = pros;
  const [listMentor, setListMentor] = useState<MentorInfor[]>();

  useEffect(() => {
    const handelListMentor = async () => {
      const resListMentor = await sendRequest<MentorInfor[]>({
        // url: "https://artdevs-server.azurewebsites.net/api/get-mentor",
        // url: "http://localhost:8080/api/post/page",
        url: "http://localhost:8080/api/get-mentor",
        method: "GET",
        headers: { authorization: `Bearer ${user?.access_token}` },
      });
      resListMentor ? setListMentor(resListMentor) : "";
      console.log(">>> chcekc resListMentor: ", resListMentor);
    };
    handelListMentor();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, marginTop: "24px" }}>
      <Grid container columns={16} spacing={2}>
        {listMentor &&
          listMentor.map((item, index) => (
            <Grid item xs={16} md={8} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image="/logo.png"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
export default HomeMentor;
