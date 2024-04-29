"use client";
import { sendRequest } from "@/components/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GLOBAL_URL } from "../utils/veriable.global";
import FirstLoginInfor from "./first.login.info";
interface IPros {
  session: User;
}
const FirstLogin = ({ session }: IPros) => {
  const { update: sessionUpdate } = useSession();
  const [data, setData] = useState<UserLogin>();
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
          url: GLOBAL_URL + "/api/programingLanguage",
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
        if (data) {
          const response = await sendRequest<ResponseStatus>({
            url: GLOBAL_URL + "/api/user/update-profile",
            method: "PUT",
            body: { ...data },
          });

          if (
            //@ts-ignore
            response?.statusCode != 400
          ) {
            const updatedUserData: User = {
              access_token: session?.access_token,
              refresh_token: session?.refresh_token,
              user: {
                ...data,
              },
            };
            await sessionUpdate(updatedUserData);
            router.push("/");
            router.refresh();
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
    <FirstLoginInfor
      address={{ provinces, districts, wards }}
      setDataRegister={setData}
      setCitys={setCity}
      setDistricts={setDistrict}
      programingLanguage={programingLanguage}
      session={session}
    />
  );
};
export default FirstLogin;
