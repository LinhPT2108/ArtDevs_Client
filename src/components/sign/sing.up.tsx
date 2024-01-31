"use client";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InforSign from "./sign-up/infor.sign";
import RoleSign from "./sign-up/role.sign";
import KnowlegdeSign from "./sign-up/knowledge.sign";
import Snowfall from "react-snowfall";
import { arrayBuffer } from "stream/consumers";
import { Alert, Snackbar, SnackbarOrigin } from "@mui/material";
// import { SHA256 } from "crypto-js";

const steps = [`Thông tin cá nhân`, "Vai trò", "Kiến thức"];

interface MyData {
  programingLanguage: MyLanguageProgram[];
  setDataRegister: (value: UserRegister) => void;
  address: { provinces: Province[]; districts: District[]; wards: Ward[] };
  setCitys: (value: Province) => void;
  setDistricts: (value: District) => void;
  errorRegister: string;
}

interface State extends SnackbarOrigin {
  open: boolean;
}

const SignUp = (props: MyData) => {
  const {
    address,
    programingLanguage,
    setDataRegister,
    setCitys,
    setDistricts,
    errorRegister,
  } = props;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isErrorFirstName, setIsErrorFirstName] = useState<boolean>(false);
  const [isErrorLastName, setIsErrorLastName] = useState<boolean>(false);
  const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
  const [isErrorConfirmPassword, setIsErrorConfirmPassword] =
    useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [state, setState] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleShowErrorMessage =
    (newState: SnackbarOrigin) => (event: React.MouseEvent) => {
      setState({ ...newState, open: true });
    };
  const [data, setData] = useState<UserRegister>({
    lastName: "",
    middleName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "male",
    city: "",
    district: "",
    ward: "",
    role: { id: 2, roleName: "user" },
    userId: "",
    username: "",
    isOnline: false,
    listDemandOfUser: [],
    listSkillOfUser: [],
  });
  const handleUserName = (
    firstName: string,
    middleName: string,
    lastName: string
  ) => {
    let userName = "";
    if (!middleName) {
      userName = firstName + " " + lastName;
    } else {
      userName = firstName + " " + middleName + " " + lastName;
    }
    setData((prevData) => ({
      ...prevData,
      username: userName,
    }));
  };
  const handleLastName = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      lastName: value,
    }));
  };
  const handleMiddleName = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      middleName: value,
    }));
  };
  const handleFirstName = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      firstName: value,
    }));
  };
  const handleEmail = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      email: value,
    }));
  };
  const handlePassword = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      password: value,
    }));
  };
  const handleConfirmPassword = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      confirmPassword: value,
    }));
  };
  const handleDateOfBirth = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      dateOfBirth: value,
    }));
  };
  const handleGender = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };
  const handleCity = (value: Province) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        city: value?.province_name,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        city: "",
        district: "",
        ward: "",
      }));
    }
  };
  const handleDistrict = (value: District) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        district: value?.district_name,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        district: "",
        ward: "",
      }));
    }
  };
  const handleWard = (value: Ward) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        ward: value?.ward_name,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        ward: "",
      }));
    }
  };
  const handleRole = (value: Role) => {
    setData((prevData) => ({
      ...prevData,
      role: value,
    }));
  };
  const handleListDemandOfUser = (myLanguageProgram: MyLanguageProgram[]) => {
    let arrayOfValues: string[] = [];
    if (myLanguageProgram) {
      arrayOfValues = Object.values(myLanguageProgram).map(
        (item) => item.languageName
      );
    }
    setData((prevData) => ({
      ...prevData,
      listDemandOfUser: arrayOfValues,
    }));
  };
  const handleListSkillOfUser = (myLanguageProgram: MyLanguageProgram[]) => {
    let arrayOfValues: string[] = [];
    if (myLanguageProgram) {
      arrayOfValues = Object.values(myLanguageProgram).map(
        (item) => item.languageName
      );
    }
    setData((prevData) => ({
      ...prevData,
      listSkillOfUser: arrayOfValues,
    }));
  };
  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    setSkipped(newSkipped);
    handleUserName(data.firstName, data.middleName, data.lastName);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleSignUp = () => {
    setFinish(true);
    setDataRegister(data);
  };

  const handleClick = () => {
    activeStep >= steps.length - 1 ? handleSignUp() : handleNext();
  };

  const [snowfallImages, setSnowfallImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadImage = async () => {
      const image = new Image();
      image.src = "/snowflake.png";
      await image.decode();
      setSnowfallImages([image]);
    };

    loadImage();
  }, []);

  const handleRequest = (event: React.KeyboardEvent | React.MouseEvent) => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  useEffect(() => {
    const handleFailRegister = async () => {
      if (errorRegister) {
        if (activeStep !== 0) {
          setFinish(false);
          handleRequest({} as React.MouseEvent);
          // handleRequest({} as React.MouseEvent);
          handleShowErrorMessage({ vertical: "top", horizontal: "center" })(
            {} as React.MouseEvent
          );
        }
      }
    };
    handleFailRegister();
  }, [errorRegister]);

  console.log(">>> check data: ", data);

  useEffect(() => {
    const handleButtonContinue = () => {
      if (!data.firstName) {
        setDisableButton(true);
        return;
      }
      if (!data.lastName) {
        setDisableButton(true);
        return;
      }
      if (!data.email) {
        setDisableButton(true);
        return;
      }
      if (!data.password) {
        setDisableButton(true);
        return;
      }
      if (data.confirmPassword !== data.password || !data.confirmPassword) {
        setDisableButton(true);
        return;
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!passwordRegex.test(data.password) || !emailRegex.test(data.email)) {
        console.log(
          ">>> co vo khong",
          passwordRegex.test(data.password) || emailRegex.test(data.email)
        );

        setDisableButton(true);
        return;
      }
      setDisableButton(false);
    };
    handleButtonContinue();
  }, [data]);
  return (
    <Box
      sx={{
        display: "flex",
        height: { xs: "auto", md: "100%" },
        width: "100%",
        padding: "24px 0",
      }}
    >
      <Snowfall
        snowflakeCount={200}
        speed={[0, 0.5]}
        wind={[0, 3]}
        radius={[1, 15]}
        rotationSpeed={[-1, 1]}
        images={snowfallImages}
      />
      <Box
        sx={{
          backgroundColor: "#ffffff",
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
          borderRadius: "8px",
          margin: "auto",
          // minHeight: "720px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "@media (min-width: 280px)": {
            width: "270px",
          },
          "@media (min-width: 340px)": {
            width: "330px",
          },
          "@media (min-width: 400px)": {
            width: "380px",
          },
          "@media (min-width: 480px)": {
            width: "450px",
          },
          "@media (min-width: 600px)": {
            width: "550px",
          },
          "@media (min-width: 768px)": {
            width: "750px",
          },
          "@media (min-width: 900px)": {
            width: "850px",
          },
          "@media (min-width: 1023px)": {
            width: "1000px",
          },
          "@media (min-width: 1210px)": {
            width: "1024px",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              padding: "12px 0",
              fontSize: { xs: "24px", sm: "36px" },
              fontWeight: "700",
              wordSpacing: 2,
              letterSpacing: 1.5,
              color: "#1976d2",
              backgroundColor: "#cfd2d4",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            Đăng Ký Thành Viên
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              boxShadow: "0px -3px 3px 0px rgba(0,0,0,0.35) inset",
              minHeight: "620px",
            }}
          >
            <Box sx={{ mt: 2, mb: 1, mx: 2, flex: "1" }}>
              {activeStep === 0 ? (
                <InforSign
                  handleLastName={handleLastName}
                  handleMiddleName={handleMiddleName}
                  handleFirstName={handleFirstName}
                  handleEmail={handleEmail}
                  handlePassword={handlePassword}
                  handleConfirmPassword={handleConfirmPassword}
                  handleDateOfBirth={handleDateOfBirth}
                  handleGender={handleGender}
                  handleCity={handleCity}
                  handleDistrict={handleDistrict}
                  handleWard={handleWard}
                  address={address}
                  setCitys={setCitys}
                  setDistricts={setDistricts}
                  data={data}
                  isErrorFirstName={isErrorFirstName}
                  isErrorLastName={isErrorLastName}
                  isErrorEmail={isErrorEmail}
                  isErrorPassword={isErrorPassword}
                  isErrorConfirmPassword={isErrorConfirmPassword}
                  setIsErrorFirstName={setIsErrorFirstName}
                  setIsErrorLastName={setIsErrorLastName}
                  setIsErrorEmail={setIsErrorEmail}
                  setIsErrorPassword={setIsErrorPassword}
                  setIsErrorConfirmPassword={setIsErrorConfirmPassword}
                  errorRegister={errorRegister}
                />
              ) : activeStep === 1 ? (
                <RoleSign
                  handleRole={handleRole}
                  roleName={data.role.roleName}
                />
              ) : (
                <KnowlegdeSign
                  programingLanguage={programingLanguage}
                  role={data.role}
                  handleListDemandOfUser={handleListDemandOfUser}
                  handleListSkillOfUser={handleListSkillOfUser}
                  data={data}
                />
              )}
            </Box>

            {finish ? (
              <Box sx={{ display: "flex", flexDirection: "row", p: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "160px" }}
                >
                  <CircularProgress sx={{ color: "#ffffff" }} />
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "row", p: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 1,
                    display: `${activeStep === 0 ? "none" : "inline"}`,
                    width: "160px",
                    fontSize: "16px",
                    paddingY: "11px",
                  }}
                >
                  Back
                </Button>

                <Box sx={{ flex: "1 1 auto" }} />

                <Button
                  onClick={handleClick}
                  disabled={disableButton}
                  variant="contained"
                  color="primary"
                  sx={{ fontSize: "16px", width: "160px", paddingY: "11px" }}
                >
                  {activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp tục"}
                </Button>
              </Box>
            )}
          </Box>
          <Stepper
            activeStep={activeStep}
            sx={{
              paddingY: "16px",
            }}
          >
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              //   if (isStepOptional(index)) {
              //     labelProps.optional = (
              //       <Typography variant="caption">Optional</Typography>
              //     );
              //   }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Đăng ký thất bại !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;
