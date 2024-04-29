"use client";
import { Alert, CardMedia, Snackbar, SnackbarOrigin } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Link from "next/link";
import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import "../../style/loading.css";
import KnowlegdeSign from "../sign/sign-up/knowledge.sign";
import { sendRequest } from "../utils/api";
import { checkAge, removeExtraSpaces } from "../utils/utils";
import { GLOBAL_URL } from "../utils/veriable.global";
import FirstLoginInforModel from "./first.login.infor.model";

const steps = [`Thông tin cá nhân`, "Danh mục quan tâm"];

interface MyData {
  programingLanguage: MyLanguageProgram[];
  setDataRegister: (value: UserLogin) => void;
  address: { provinces: Province[]; districts: District[]; wards: Ward[] };
  setCitys: (value: Province) => void;
  setDistricts: (value: District) => void;
  session: User;
}

interface State extends SnackbarOrigin {
  open: boolean;
}

interface CubeSpanProps {
  index: number;
}
const CubeSpan: React.FC<CubeSpanProps> = ({ index }) => {
  const spanStyle: React.CSSProperties = {
    ["--i" as any]: index,
  };

  return <span style={spanStyle} className="cube-span"></span>;
};

const FirstLoginInfor = (props: MyData) => {
  const {
    address,
    programingLanguage,
    setDataRegister,
    setCitys,
    setDistricts,
    session,
  } = props;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isErrorFirstName, setIsErrorFirstName] = useState<boolean>(false);
  const [isErrorLastName, setIsErrorLastName] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorDemand, setErrorDemand] = useState<boolean>(false);
  const [messageDemand, setMessageDemand] = useState<string>("");
  const [errorDateOfBirth, setErrorDateOfBirth] = useState<boolean>(false);
  const [messageDateOfBirth, setMessageDateOfBirth] = useState<string>("");
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
  const [data, setData] = useState<UserLogin>(session?.user);
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
      lastName: removeExtraSpaces(value),
    }));
  };
  const handleMiddleName = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      middleName: removeExtraSpaces(value),
    }));
  };
  const handleFirstName = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      firstName: removeExtraSpaces(value),
    }));
  };

  const handleDateOfBirth = (value: string) => {
    if (value) {
      if (checkAge(value)) {
        setErrorDateOfBirth(false);
        setMessageDateOfBirth("");
      } else {
        setErrorDateOfBirth(true);
        setMessageDateOfBirth("Tuổi không hợp lệ");
      }
    } else {
      setErrorDateOfBirth(true);
      setMessageDateOfBirth("Không được để trống ngày sinh !");
    }
    setData((prevData) => ({
      ...prevData,
      birthday: value,
    }));
  };
  const handleGender = (value: number) => {
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
  const handleListDemandOfUser = (myLanguageProgram: MyLanguageProgram[]) => {
    let arrayOfValues: string[] = [];
    if (myLanguageProgram) {
      arrayOfValues = Object.values(myLanguageProgram).map(
        (item) => item.languageName
      );
    }
    if (myLanguageProgram.length > 0) {
      setErrorDemand(false);
      setMessageDemand("");
    } else {
      setErrorDemand(true);
      setMessageDemand("Chọn ít nhất một danh mục quan tâm !");
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

  const handleFirstLoginInfor = () => {
    console.log(">>> check data:564 ");
    if (
      (data && !data?.listDemandOfUser) ||
      (data?.listDemandOfUser && data?.listDemandOfUser.length > 0)
    ) {
      setErrorDemand(false);
      setMessageDemand("");
      setFinish(true);
      setDataRegister(data);
      setLoading(true);
    } else {
      setErrorDemand(true);
      setMessageDemand("Chọn ít nhất một danh mục quan tâm !");
    }
  };

  const handleClick = () => {
    activeStep >= steps.length - 1 ? handleFirstLoginInfor() : handleNext();
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
      if (!data.birthday || errorDateOfBirth) {
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
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "rgba(232,232,232,0.5)",
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
      )}
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
              padding: "12px 24px",
              backgroundColor: "#cfd2d4",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link href="/">
              <CardMedia
                sx={{ width: { xs: "60px", sm: "100px" } }}
                component="img"
                image="/Art_Devs_aboutFooter.png"
                alt="logo"
              />
            </Link>
            <Box
              sx={{
                fontSize: { xs: "24px", sm: "36px" },
                fontWeight: "700",
                wordSpacing: 2,
                letterSpacing: 1.5,
                color: "#1976d2",
                marginX: "24px",
                "& a": { color: "#3c2cb7", textDecoration: "none" },
              }}
            >
              Chào mừng bạn đến với <Link href="/">ART DEVS</Link>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              boxShadow: "0px -3px 3px 0px rgba(0,0,0,0.35) inset",
              minHeight: "380px",
            }}
          >
            <Box sx={{ mt: 2, mb: 1, mx: 2, flex: "1", paddingX: "24px" }}>
              {activeStep === 0 ? (
                <FirstLoginInforModel
                  handleLastName={handleLastName}
                  handleMiddleName={handleMiddleName}
                  handleFirstName={handleFirstName}
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
                  setIsErrorFirstName={setIsErrorFirstName}
                  setIsErrorLastName={setIsErrorLastName}
                  messageDateOfBirth={messageDateOfBirth}
                  errorDateOfBirth={errorDateOfBirth}
                />
              ) : (
                <KnowlegdeSign
                  programingLanguage={programingLanguage}
                  role={data.role}
                  handleListDemandOfUser={handleListDemandOfUser}
                  handleListSkillOfUser={handleListSkillOfUser}
                  data={data}
                  errorDemand={errorDemand}
                  messageDemand={messageDemand}
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  p: 2,
                  "& .continue": {
                    backgroundColor: `${disableButton ? "gray" : "#1976d2"}`,
                  },
                }}
              >
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
                    marginLeft: "24px",
                  }}
                >
                  Back
                </Button>

                <Box sx={{ flex: "1 1 auto" }} />

                <Button
                  className="continue"
                  onClick={handleClick}
                  disabled={disableButton}
                  variant="contained"
                  color="primary"
                  sx={{
                    fontSize: "16px",
                    width: "160px",
                    paddingY: "11px",
                    marginRight: "24px",
                  }}
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

export default FirstLoginInfor;
