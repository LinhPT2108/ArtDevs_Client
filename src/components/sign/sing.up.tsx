import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InforSign from "./sign-up/infor.sign";
import RoleSign from "./sign-up/role.sign";
import KnowlegdeSign from "./sign-up/knowledge.sign";

const steps = [`Thông tin cá nhân`, "Vai trò", "Kiến thức"];

const SignUp = () => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [finish, setFinish] = React.useState<boolean>(false);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [data, setData] = React.useState<string>("");

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

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSignUp = () => {
    setFinish(true);
    console.log("Send button clicked");
  };
  const handleData = useCallback((data: string) => {
    setData(data);
  }, []);
  const handleClick = () => {
    activeStep >= steps.length - 1 ? handleSignUp() : handleNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
          borderRadius: "8px",
          margin: "auto",
          height: "720px",
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
            width: "1200px",
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
              height: "83%",
            }}
          >
            <Box sx={{ mt: 2, mb: 1, mx: 2, flex: "1" }}>
              {activeStep === 0 ? (
                <InforSign onInputChange={handleData} />
              ) : activeStep === 1 ? (
                <RoleSign />
              ) : (
                <KnowlegdeSign />
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
    </Box>
  );
};

export default SignUp;
