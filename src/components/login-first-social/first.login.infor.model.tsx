import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { deleteSpace, removeExtraSpaces } from "../utils/utils";

interface IPros {
  handleLastName: (data: string) => void;
  handleMiddleName: (data: string) => void;
  handleFirstName: (data: string) => void;
  handleDateOfBirth: (data: string) => void;
  handleGender: (data: number) => void;
  handleCity: (data: Province) => void;
  handleDistrict: (data: District) => void;
  handleWard: (data: Ward) => void;
  address: { provinces: Province[]; districts: District[]; wards: Ward[] };
  setCitys: (value: Province) => void;
  setDistricts: (value: District) => void;
  data: UserLogin;
  isErrorFirstName: boolean;
  isErrorLastName: boolean;
  setIsErrorFirstName: (value: boolean) => void;
  setIsErrorLastName: (value: boolean) => void;
  errorDateOfBirth: boolean;
  messageDateOfBirth: string;
}
const FirstLoginInforModel = (props: IPros) => {
  const {
    handleLastName,
    handleMiddleName,
    handleFirstName,
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
    setIsErrorFirstName,
    setIsErrorLastName,
    messageDateOfBirth,
    errorDateOfBirth,
  } = props;
  const { provinces, districts, wards } = address;

  const [gender, setGender] = useState<number>(data?.gender);

  const [messageFirstName, setMessageFirstName] = useState<string>("");
  const [messageLastName, setMessageLastName] = useState<string>("");

  const handleChangeLastName = (value: string) => {
    if (value) {
      setIsErrorLastName(false);
      setMessageLastName("");
    } else {
      setIsErrorLastName(true);
      setMessageLastName("Vui lòng nhập họ của bạn !");
    }
    handleLastName(removeExtraSpaces(value));
  };

  const handleChangeFirstName = (value: string) => {
    if (value) {
      setIsErrorFirstName(false);
      setMessageFirstName("");
    } else {
      setIsErrorFirstName(true);
      setMessageFirstName("Vui lòng nhập tên của bạn !");
    }
    handleFirstName(removeExtraSpaces(value));
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
            sx={{ paddingLeft: "0 !important" }}
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
                error={errorDateOfBirth}
                helperText={messageDateOfBirth}
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
                  Giới tính
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
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            item
            xs={24}
            columns={24}
            container
            spacing={1}
            sx={{ paddingLeft: "0 !important" }}
          >
            <Grid item xs={24} md={8}>
              <Autocomplete
                id="country-select-demo"
                // sx={{ width: 300 }}
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
                // sx={{ width: 300 }}
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
                // sx={{ width: 300 }}
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
        </Grid>
      </Box>
    </Box>
  );
};

export default FirstLoginInforModel;
