import { sendRequest } from "@/components/utils/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
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
import { log } from "console";
import { useEffect, useState } from "react";

interface IPros {
  handleLastName: (data: string) => void;
  handleMiddleName: (data: string) => void;
  handleFirstName: (data: string) => void;
  handleEmail: (data: string) => void;
  handlePassword: (data: string) => void;
  handleConfirmPassword: (data: string) => void;
  handleDateOfBirth: (data: string) => void;
  handleGender: (data: number) => void;
  handleCity: (data: Province) => void;
  handleDistrict: (data: District) => void;
  handleWard: (data: Ward) => void;
  address: { provinces: Province[]; districts: District[]; wards: Ward[] };
  setCitys: (value: Province) => void;
  setDistricts: (value: District) => void;
  data: UserRegister;
  isErrorFirstName: boolean;
  isErrorLastName: boolean;
  isErrorEmail: boolean;
  isErrorPassword: boolean;
  isErrorConfirmPassword: boolean;
  setIsErrorFirstName: (value: boolean) => void;
  setIsErrorLastName: (value: boolean) => void;
  setIsErrorEmail: (value: boolean) => void;
  setIsErrorPassword: (value: boolean) => void;
  setIsErrorConfirmPassword: (value: boolean) => void;
  errorRegister: string;
  isErrorEmailExist: boolean;
  setIsErrorEmailExist: (value: boolean) => void;
  emailExist: string;
  setEmailExist: (value: string) => void;
}
const InforSign = (props: IPros) => {
  const {
    handleLastName,
    handleMiddleName,
    handleFirstName,
    handleEmail,
    handlePassword,
    handleConfirmPassword,
    handleDateOfBirth,
    handleGender,
    handleCity,
    handleDistrict,
    handleWard,
    address,
    setCitys,
    setDistricts,
    data,
    isErrorFirstName,
    isErrorLastName,
    isErrorEmail,
    isErrorPassword,
    isErrorConfirmPassword,
    setIsErrorFirstName,
    setIsErrorLastName,
    setIsErrorEmail,
    setIsErrorPassword,
    setIsErrorConfirmPassword,
    errorRegister,
    isErrorEmailExist,
    setIsErrorEmailExist,
    emailExist,
    setEmailExist,
  } = props;
  const { provinces, districts, wards } = address;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [gender, setGender] = useState<number>(data?.gender);

  const [messageFirstName, setMessageFirstName] = useState<string>("");
  const [messageLastName, setMessageLastName] = useState<string>("");
  const [messageEmail, setMessageEmail] = useState<string>("");
  const [messagePassword, setMessagePassword] = useState<string>("");
  const [messageConfirmPassword, setMessageConfirmPassword] =
    useState<string>("");

  const handleChangeLastName = (value: string) => {
    if (value) {
      setIsErrorLastName(false);
      setMessageLastName("");
    } else {
      setIsErrorLastName(true);
      setMessageLastName("Vui lòng nhập họ của bạn !");
    }
    handleLastName(value);
  };

  const handleChangeFirstName = (value: string) => {
    if (value) {
      setIsErrorFirstName(false);
      setMessageFirstName("");
    } else {
      setIsErrorFirstName(true);
      setMessageFirstName("Vui lòng nhập tên của bạn !");
    }
    handleFirstName(value);
  };
  const handleChangeEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsErrorEmailExist(false);
    setEmailExist("");
    if (value) {
      if (emailRegex.test(value)) {
        setIsErrorEmail(false);
        setMessageEmail("");
      } else {
        setIsErrorEmail(true);
        setMessageEmail("Email không hợp lệ !");
      }
    } else {
      setIsErrorEmail(true);
      setMessageEmail("Vui lòng nhập email !");
    }
    handleEmail(value);
  };
  const handleChangePassword = (value: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    if (value) {
      if (passwordRegex.test(value)) {
        if (data.confirmPassword) {
          if (data.confirmPassword !== value) {
            setIsErrorConfirmPassword(true);
            setMessageConfirmPassword("Mật khẩu chưa khớp !");
          } else {
            setIsErrorConfirmPassword(false);
            setMessageConfirmPassword("");
          }
        }
        setIsErrorPassword(false);
        setMessagePassword("");
      } else {
        setIsErrorPassword(true);
        setMessagePassword(
          "Mật khẩu ít nhất 6 ký tự (hoa, thường, đặc biệt) !"
        );
      }
    } else {
      setIsErrorPassword(true);
      setMessagePassword("Mật khẩu không được để trống !");
    }
    handlePassword(value);
  };
  const handleChangeConfirmPassword = (value: string) => {
    if (value) {
      if (data.password === value) {
        setIsErrorConfirmPassword(false);
        setMessageConfirmPassword("");
      } else {
        setIsErrorConfirmPassword(true);
        setMessageConfirmPassword("Mật khẩu chưa khớp !");
      }
    } else {
      setIsErrorConfirmPassword(true);
      setMessageConfirmPassword("Xác nhận mật khẩu không hợp lệ !");
    }
    handleConfirmPassword(value);
  };
  const handleChangeDateOfBirth = (value: string) => {
    if (value) {
      setIsErrorConfirmPassword(false);
    } else {
      setIsErrorConfirmPassword(true);
      setMessageConfirmPassword("Chưa chọn ngày sinh !");
    }
    handleDateOfBirth(value);
  };
  const handleFailRegister = () => {
    setMessageEmail(errorRegister);
    setIsErrorEmail(true);
  };
  useEffect(() => {
    if (errorRegister) {
      handleFailRegister();
    }
  }, [errorRegister]);
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
          sx={{
            margin: "auto",
            paddingLeft: "0 !important",
            "@media (min-width: 280px)": {
              width: "100%",
            },
          }}
        >
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={2}
            sx={{
              paddingLeft: "0 !important",
            }}
          >
            <Grid
              item
              xs={24}
              md={8}
              sx={{
                paddingTop: { xs: "0 !important", md: "16px !important" },
              }}
            >
              <TextField
                onChange={(e) => handleChangeFirstName(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="first-name"
                label="Họ"
                name="first-name"
                autoComplete="new-first-name"
                autoFocus
                value={data?.firstName}
                error={isErrorFirstName}
                helperText={messageFirstName}
                sx={{
                  marginBottom: "0",
                }}
              />
            </Grid>
            <Grid
              item
              xs={24}
              md={8}
              sx={{
                paddingTop: { xs: "0 !important", md: "16px !important" },
              }}
            >
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
                value={data?.middleName}
                sx={{ marginBottom: "0" }}
              />
            </Grid>
            <Grid
              item
              xs={24}
              md={8}
              sx={{
                paddingTop: { xs: "0 !important", md: "16px !important" },
              }}
            >
              <TextField
                onChange={(e) => handleChangeLastName(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="last-name"
                label="Tên"
                name="last-name"
                autoComplete="new-last-name"
                autoFocus
                value={data?.lastName}
                error={isErrorLastName}
                helperText={messageLastName}
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
                onChange={(e) => handleChangeEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="new-email"
                autoFocus
                value={data?.email}
                error={isErrorEmail || isErrorEmailExist}
                helperText={messageEmail || emailExist}
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
                onChange={(e) => handleChangePassword(e.target.value)}
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
                value={data?.password}
                error={isErrorPassword}
                helperText={messagePassword}
                sx={{ mb: { xs: 0, md: 3 } }}
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
            <Grid
              item
              xs={24}
              md={12}
              sx={{ paddingTop: { xs: "0 !important", md: "16px !important" } }}
            >
              <TextField
                onChange={(e) => handleChangeConfirmPassword(e.target.value)}
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
                value={data?.confirmPassword}
                error={isErrorConfirmPassword}
                helperText={messageConfirmPassword}
                sx={{ mb: { xs: 0, md: 3 } }}
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
            <Grid
              item
              xs={24}
              md={12}
              sx={{ paddingTop: { xs: "16px !important", md: "0 !important" } }}
            >
              <TextField
                onChange={(e) => handleDateOfBirth(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                type="date"
                id="date-of-birth"
                label="Ngày sinh"
                name="date-of-birth"
                autoComplete="new-date-of-birth"
                autoFocus
                value={data?.birthday}
                // error={}
                sx={{
                  marginBottom: "0",
                  "& input": {
                    paddingLeft: `${data?.birthday ? "14px" : "100px"}`,
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
                    setGender(+e.target.value);
                    handleGender(+e.target.value);
                  }}
                >
                  <FormControlLabel value="1" control={<Radio />} label="Nam" />
                  <FormControlLabel value="2" control={<Radio />} label="Nữ" />
                  <FormControlLabel
                    value="3"
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
              <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
                options={provinces || []}
                autoHighlight
                getOptionLabel={(province) => province?.province_name}
                value={provinces.find(
                  (province) => province?.province_name === data?.city
                )}
                onChange={(event, newValue) => {
                  handleCity(newValue!);
                  setCitys(newValue!);
                }}
                renderOption={(props, province) => (
                  <Box component="li" {...props}>
                    {province?.province_name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn tỉnh/TP"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={24} md={8}>
              <Autocomplete
                id="district-select-demo"
                sx={{ width: 300 }}
                options={districts || []}
                autoHighlight
                getOptionLabel={(district) => district.district_name}
                value={
                  districts.length > 0
                    ? districts?.find(
                        (district) => district.district_name === data?.district
                      )
                    : null
                }
                onChange={(event, newValue) => {
                  handleDistrict(newValue!);
                  setDistricts(newValue!);
                }}
                renderOption={(props, district) => (
                  <Box component="li" {...props}>
                    {district.district_name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn Quận/Huyện"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={24} md={8}>
              <Autocomplete
                id="district-select-demo"
                sx={{ width: 300 }}
                options={wards || []}
                autoHighlight
                getOptionLabel={(ward) => ward.ward_name}
                value={
                  wards.length > 0
                    ? wards.find((ward) => ward.ward_name === data?.ward)
                    : null
                }
                onChange={(event, newValue) => {
                  handleWard(newValue!);
                }}
                renderOption={(props, ward) => (
                  <Box component="li" {...props}>
                    {ward.ward_name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn Xã/Phường/TT"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
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
