import { format, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const generateUniqueId = (): string => {
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
export const isImage = (url: string) => {
  try {
    const extension = url.split(".").pop()?.toLowerCase();
    if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "gif"
    ) {
      return "image";
    } else if (
      extension === "mp4" ||
      extension === "webm" ||
      extension === "avi"
    ) {
      return "video";
    } else {
      return "file";
    }
  } catch (error) {
    console.error("Error checking content type:", error);
    return "unknown";
  }
};

export const formatTimeDifference = (
  startTime: Date,
  endTime: Date
): string => {
  const differenceInMilliseconds = startTime.getTime() - endTime.getTime();

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `${seconds} giây trước`;
  }
};

export const formatVND = (value: number): string => {
  // Use toLocaleString to format the number with commas
  const formattedValue = value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return formattedValue;
};


export const formatDateString = (input: string | null): string => {
  if (input) {
    const dateObject = parseISO(input);
    const formattedDate = format(dateObject, "HH:mm:ss dd/MM/yyyy");
    return formattedDate;
  } else {
    return "";
  }
};

export function deleteSpace(value: string): string {
  const char: string[] = value.split(" ");

  const result: string = char.join(" ");

  return result;
}

