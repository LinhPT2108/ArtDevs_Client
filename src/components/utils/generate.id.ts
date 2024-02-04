import { v4 as uuidv4 } from "uuid";

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
export default generateUniqueId;
