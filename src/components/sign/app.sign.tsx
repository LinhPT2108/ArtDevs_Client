"use client";
import SignUp from "@/components/sign/sing.up";
import { sendRequest } from "@/components/utils/api";
import NextAuthWrapper from "@/lib/next.auth.provider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { generateUniqueId } from "../utils/utils";
import { useUser } from "@/lib/custom.content";
import { truncate } from "fs/promises";

const AppSignUp = () => {
  const { setUser } = useUser();
  const [errorRegister, setErrorRegister] = useState<string>("");
  const [data, setData] = useState<UserRegister>();
  const [programingLanguage, setProgramingLanguage] = useState<
    MyLanguageProgram[]
  >([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const router = useRouter();
  const [city, setCity] = useState<Province>();
  const [district, setDistrict] = useState<District>();
  useEffect(() => {
    const fetchDataProvince = async () => {
      try {
        const province = await sendRequest<Result<Province[]>>({
          // url: "https://artdevs-server.azurewebsites.net/api/programingLanguage",
          // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/programingLanguage",
          url: "https://vapi.vnappmob.com/api/province/",
          method: "GET",
        });
        province && setProvinces(province.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataProvince();
  }, []);

  useEffect(() => {
    const fetchDataDistrict = async () => {
      try {
        if (city && city?.province_id) {
          const district = await sendRequest<Result<District[]>>({
            url: `https://vapi.vnappmob.com/api/province/district/${city.province_id}`,
            method: "GET",
          });
          district && setDistricts(district.results);
        } else {
          setDistricts([]);
          setDistrict(undefined);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataDistrict();
  }, [city]);

  useEffect(() => {
    const fetchDataWard = async () => {
      try {
        if (district && district?.district_id) {
          const ward = await sendRequest<Result<Ward[]>>({
            url: `https://vapi.vnappmob.com/api/province/ward/${district?.district_id}`,
            method: "GET",
          });
          ward && setWards(ward.results);
        } else {
          setWards([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataWard();
  }, [district]);
  useEffect(() => {
    const fetchDataDemand = async () => {
      try {
        const response = await sendRequest<MyLanguageProgram[]>({
          // url: "https://artdevs-server.azurewebsites.net/api/programingLanguage",
          // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/programingLanguage",
          url: "http://localhost:8080/api/programingLanguage",
          method: "GET",
        });
        response && setProgramingLanguage(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataDemand();
  }, []);

  useEffect(() => {
    const fetchDataSignUp = async () => {
      try {
        // <IBackendRes<UserLogin>></IBackendRes>
        if (data) {
          data && (data.userId = generateUniqueId());
          const { gender, confirmPassword, ...restData } = data;
          console.log(">>> check data register: ", data);
          const response = await sendRequest<IBackendRes<UserLogin>>({
            // url: "https://artdevs-server.azurewebsites.net/api/register",
            // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/register",
            url: "http://localhost:8080/api/register",
            method: "POST",
            body: { ...restData },
          });
          if (response?.statusCode != 400) {
            const res = await signIn("credentials", {
              username: data?.email,
              password: data?.password,
              redirect: true,
            });
            if (!res?.error) {
              router.push("/");
              //@ts-ignore
              setUser(res);
            }
          } else {
            setErrorRegister(response?.message);
          }
          console.log(">>> check res register: ", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataSignUp();
  }, [data, programingLanguage]);

  return (
    <NextAuthWrapper>
      <SignUp
        address={{ provinces, districts, wards }}
        setDataRegister={setData}
        setCitys={setCity}
        setDistricts={setDistrict}
        programingLanguage={programingLanguage}
        errorRegister={errorRegister}
      />
    </NextAuthWrapper>
  );
};
export default AppSignUp;
