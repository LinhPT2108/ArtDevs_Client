"use client";
import { FC, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import InputField from "@/components/admin/fields/InputField";
import Checkbox from "@/components/admin/checkbox";
import { Box, SnackbarOrigin } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/custom.content";
import Snowfall from "react-snowfall";
import { CubeSpan } from "@/components/utils/component.global";

type Props = {};

interface State extends SnackbarOrigin {
  open: boolean;
}

const AuthPage: FC<Props> = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPassword, setMessageErrorPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleSubmit = async () => {
    setIsErrorEmail(false);
    setIsErrorPassword(false);
    setMessageErrorEmail("");
    setMessageErrorPassword("");
    if (!email) {
      setIsErrorEmail(true);
      setMessageErrorEmail("Email không được để trống !");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setMessageErrorPassword("Mật khẩu không được để trống !");
      return;
    }

    try {
      setLoading(true);
      const res = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      });
      if (!res?.error) {
        //@ts-ignore
        setUser(res);
        router.push("/admin/dashboard");
      } else {
        setLoading(false);
        setIsErrorEmail(true);
        setIsErrorPassword(true);
        handleClick({ vertical: "top", horizontal: "center" })(
          {} as React.MouseEvent
        );
      }
    } catch {
    } finally {
      // setLoading(false);
    }
  };
  const handleChangeEmail = (value: string) => {
    setIsErrorEmail(false);
    setMessageErrorEmail("");
    setEmail(value);
  };
  const handleChangePassword = (value: string) => {
    setIsErrorPassword(false);
    setMessageErrorPassword("");
    setPassword(value);
  };
  const handleClick =
    (newState: SnackbarOrigin) => (event: React.MouseEvent) => {
      setState({ ...newState, open: true });
    };

  const handleClose = () => {
    setState({ ...state, open: false });
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
  // const handleLoginWithSocialMedia = async (provider: string) => {
  //   try {
  //     setLoading(true);
  //     signIn(provider);
  //   } catch {
  //     setLoading(false);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };
  const handleForgotPasswordLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    // setForgotPassword(true);
  };
  const handleForgotPasswordModalClose = () => {
    // setForgotPassword(false);
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "rgba(232,232,232,0.3)",
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

      <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        {/* Sign in section */}
        <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Đăng nhập
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Nhập email để đăng nhập
          </p>

          {/* Email */}
          <InputField
            handleChangeEmail={handleChangeEmail}
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
          />

          {/* Password */}
          <InputField
            handleChangeEmail={handleChangePassword}
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
          />

          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center"></div>
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href=""
            >
              Quên mật khẩu ?
            </a>
          </div>

          <button
            onClick={handleSubmit}
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
