"use client";
import SignUp from "@/components/sign/sing.up";
import { sendRequest } from "@/components/utils/api";
import NextAuthWrapper from "@/lib/next.auth.provider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const AppSignUp = () => {
  const [data, setData] = useState<UserRegister>();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data) {
          console.log(">>> check data register: ", data);
          const response = await sendRequest<IBackendRes<UserLogin>>({
            url: "https://artdevs-server.azurewebsites.net/api/register",
            method: "POST",
            body: { ...data },
          });
          if (!response?.error) {
            const res = await signIn("credentials", {
              username: data?.email,
              password: data?.password,
              redirect: false,
            });
            if (!res?.error) {
              router.push("/");
            }
          }
          console.log(">>> check res register: ", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  return (
    <NextAuthWrapper>
      <SignUp setDataRegister={setData} />
    </NextAuthWrapper>
  );
};
export default AppSignUp;
