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
  onInputChange: (data: string) => void;
}
const InforSign = (onInputChange: IPros) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [age, setAge] = useState("");

  const handleChange = (value: string) => {
    setAge(value);
  };
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
                // onChange={(e) => handleChangeEmail(e.target.value)}
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
                // onChange={(e) => handleChangeEmail(e.target.value)}
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
                // onChange={(e) => handleChangeEmail(e.target.value)}
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
                // onChange={(e) => handleChangeEmail(e.target.value)}
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
                // onChange={(e) => handleChangeEmail(e.target.value)}
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
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="male"
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
                  value={age}
                  label="Tỉnh/Thành phố *"
                  onChange={(e) => handleChange(e.target.value)}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
                  value={age}
                  label="Quận/Huyện *"
                  onChange={(e) => handleChange(e.target.value)}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
                  value={age}
                  label="Xã/Phường *"
                  onChange={(e) => handleChange(e.target.value)}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
