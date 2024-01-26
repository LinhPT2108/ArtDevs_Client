import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface IPros {
  handleLastName: (data: string) => void;
  handleMiddleName: (data: string) => void;
  handleFirstName: (data: string) => void;
  handleEmail: (data: string) => void;
  handlePassword: (data: string) => void;
  handleDateOfBirth: (data: string) => void;
  handleGender: (data: string) => void;
  handleCity: (data: string) => void;
  handleDistrict: (data: string) => void;
  handleWard: (data: string) => void;
}
const InforSign = (props: IPros) => {
  const {
    handleLastName,
    handleMiddleName,
    handleFirstName,
    handleEmail,
    handlePassword,
    handleDateOfBirth,
    handleGender,
    handleCity,
    handleDistrict,
    handleWard,
  } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const [gender, setGender] = useState<string>("male");

  return (
    <Box>
      <Box sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}>
        Thông tin cá nhân
      </Box>
      <Box sx={{ display: "flex" }}>
        <Grid
          container
          columns={24}
          spacing={2}
          sx={{ margin: "auto", paddingLeft: "0 !important" }}
        >
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{ paddingLeft: "0 !important" }}
          >
            <Grid item xs={24} md={8}>
              <TextField
                onChange={(e) => handleFirstName(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="first-name"
                label="Họ"
                name="first-name"
                autoComplete="new-first-name"
                autoFocus
                // error={isErrorEmail}
                // helperText={messageErrorEmail}
                sx={{ marginBottom: "0" }}
              />
            </Grid>
            <Grid item xs={24} md={8}>
              <TextField
                onChange={(e) => handleMiddleName(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                id="middle-name"
                label="Tên đệm"
                name="middle-name"
                autoComplete="new-middle-name"
                autoFocus
                // error={isErrorEmail}
                // helperText={messageErrorEmail}
                sx={{ marginBottom: "0" }}
              />
            </Grid>
            <Grid item xs={24} md={8}>
              <TextField
                onChange={(e) => handleLastName(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="last-name"
                label="Tên"
                name="last-name"
                autoComplete="new-last-name"
                autoFocus
                // error={isErrorEmail}
                // helperText={messageErrorEmail}
                sx={{ marginBottom: "0" }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{ paddingLeft: "0 !important", paddingTop: "0 !important" }}
          >
            <Grid item xs={24}>
              <TextField
                onChange={(e) => handleEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="new-email"
                autoFocus
                // error={isErrorEmail}
                // helperText={messageErrorEmail}
                sx={{ marginBottom: "0" }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{ paddingLeft: "0 !important", paddingTop: "0 !important" }}
          >
            <Grid item xs={24} md={12}>
              <TextField
                onChange={(e) => handlePassword(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     handleSubmit();
                //   }
                // }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={!showPassword ? "password" : "text"}
                id="password"
                autoComplete="new-password"
                // error={isErrorPassword}
                // helperText={messageErrorPassword}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={24} md={12}>
              <TextField
                // onChange={(e) => handleChangePassword(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     handleSubmit();
                //   }
                // }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirm-password"
                label="Xác nhận mật khẩu"
                type={!showConfirmPassword ? "password" : "text"}
                id="confirm-password"
                autoComplete="new-confirm-password"
                // error={isErrorPassword}
                // helperText={messageErrorPassword}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{ paddingLeft: "0 !important", paddingTop: "0 !important" }}
          >
            <Grid item xs={24} md={12} sx={{ paddingTop: "0 !important" }}>
              <TextField
                onChange={(e) => handleDateOfBirth(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="date"
                id="date-of-birth"
                label="Ngày sinh"
                name="date-of-birth"
                autoComplete="new-date-of-birth"
                autoFocus
                // error={isErrorEmail}
                // helperText={messageErrorEmail}
                sx={{
                  marginBottom: "0",
                  "& input": {
                    paddingLeft: "100px",
                    "&:focus": {
                      paddingLeft: "14px",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={24} md={12}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    handleGender(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Khác"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{ paddingLeft: "0 !important" }}
          >
            <Grid item xs={24} md={8}>
              <FormControl required sx={{ m: 1, width: "100%", margin: 0 }}>
                <InputLabel id="demo-simple-select-required-label">
                  Tỉnh/Thành phố
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={city}
                  label="Tỉnh/Thành phố *"
                  onChange={(e) => {
                    setCity(e.target.value);
                    handleCity(e.target.value);
                  }}
                >
                  <MenuItem value={65}>Cần Thơ</MenuItem>
                  <MenuItem value={68}>Kiên Giang</MenuItem>
                  <MenuItem value={50}>TP Hồ Chí Minh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={24} md={8}>
              <FormControl required sx={{ m: 1, width: "100%", margin: 0 }}>
                <InputLabel id="demo-simple-select-required-label">
                  Quận/Huyện
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={district}
                  label="Quận/Huyện *"
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    handleDistrict(e.target.value);
                  }}
                >
                  <MenuItem value={1}>Ninh Kiều</MenuItem>
                  <MenuItem value={2}>Quận 1</MenuItem>
                  <MenuItem value={3}>Hà Tiên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={24} md={8}>
              <FormControl required sx={{ m: 1, width: "100%", margin: 0 }}>
                <InputLabel id="demo-simple-select-required-label">
                  Xã/Phường
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={ward}
                  label="Xã/Phường *"
                  onChange={(e) => {
                    setWard(e.target.value);
                    handleWard(e.target.value);
                  }}
                >
                  <MenuItem value={1}>An Hòa</MenuItem>
                  <MenuItem value={2}>Phường 1</MenuItem>
                  <MenuItem value={3}>Phường 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{ paddingLeft: "0 !important" }}
          >
            <Grid item xs={24}>
              Điều khoản và chính sách
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InforSign;
