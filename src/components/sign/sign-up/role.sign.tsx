import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
interface IProps {
  roleName: string;
  handleRole: (value: Role) => void;
}

const CustomRadioInput = (props: IProps) => {
  const { roleName, handleRole } = props;
  const [selectedValue, setSelectedValue] = React.useState(roleName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = (event.target as HTMLInputElement).value;
    setSelectedValue(value);
    if (value === "user") {
      handleRole({ id: 1, roleName: value });
    } else {
      handleRole({ id: 3, roleName: value });
    }
  };

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: { xs: 18, sm: 24 },
          marginBottom: "12px",
        }}
      >
        Hãy chọn vai trò của bạn
      </FormLabel>
      <RadioGroup
        row
        aria-label="role-sign"
        name="role-sign"
        value={selectedValue}
        onChange={handleChange}
        sx={{ width: "100%", justifyContent: "space-evenly" }}
      >
        <FormControlLabel
          value="user"
          control={<Radio />}
          sx={{
            position: "relative",
            mx: 0,
            "& .MuiRadio-root": {
              position: "absolute",
              top: 0,
              right: 0,
            },
          }}
          label={
            <Card sx={{ maxWidth: 440 }}>
              <CardMedia
                sx={{ height: 280, width: 440 }}
                image="/share-it.webp"
                title="share-it.webp"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Học viên
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description for the first option. Description for the first
                  option. Description for the first option. Description for the
                  first option. Description for the first option. Description
                  for the first option. Description for the first option.
                  Description for the first option. Description for the first
                  option. Description for the first option. Description for the
                  first option.Description for the first option. Description for
                  the first option.Description for the first option. Description
                  for the first option.Description for the first option.
                  Description for the first option.Description for the first
                  option.
                </Typography>
              </CardContent>
            </Card>
          }
        />
        <FormControlLabel
          value="mentor"
          control={<Radio />}
          sx={{
            position: "relative",
            "& .MuiRadio-root": {
              position: "absolute",
              top: 0,
              right: 0,
            },
          }}
          label={
            <Card sx={{ maxWidth: 440 }}>
              <CardMedia
                sx={{ height: 280, width: 440 }}
                image="/Capture-1.jpg"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Giảng viên
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description for the second option. Description for the second
                  option. Description for the second option. Description for the
                  second option. Description for the second option. Description
                  for the second option. Description for the second option.
                  Description for the second option. Description for the second
                  option. Description for the second option. Description for the
                  second option. Description for the second option. Description
                  for the second option. Description for the second option.
                  Description for the second option. Description for the second
                  option.
                </Typography>
              </CardContent>
            </Card>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadioInput;
