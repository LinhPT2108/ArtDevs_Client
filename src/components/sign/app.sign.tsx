"use client";
import SignUp from "@/components/sign/sing.up";
import { sendRequest } from "@/components/utils/api";
import NextAuthWrapper from "@/lib/next.auth.provider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const generateUniqueId = (): string => {
  const currentTime = new Date().getTime().toString();
  const randomString = uuidv4().slice(0, 2);
  const combinedString = currentTime + randomString;

  //Mã hóa SHA256 cho ra chuỗi dài VD: "b88b7e817394d271578acdba5ce7e8f5532e1b5c58f2a2f965fabbacbe1930f8"
  // const hashedString = SHA256(combinedString).toString();
  // return hashedString;

  //Dùng hàm băm cho ra chuỗi ngắn hơn VD: "MTcwNjMzMTM1MzQwOTM0"
  const encodedString = btoa(combinedString);
  return encodedString;
};
const AppSignUp = () => {
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
          url: "https://artdevs-server.azurewebsites.net/api/programingLanguage",
          // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/programingLanguage",
          // url: "http://localhost:8080/api/programingLanguage",
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
            url: "https://artdevs-server.azurewebsites.net/api/register",
            // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/register",
            // url: "http://localhost:8080/api/register",
            method: "POST",
            body: { ...restData },
          });

          if (response?.statusCode != 400) {
            const res = await signIn("credentials", {
              username: data?.email,
              password: data?.password,
              redirect: false,
            });
            if (!res?.error) {
              router.push("/");
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
