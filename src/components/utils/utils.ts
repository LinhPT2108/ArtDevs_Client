import { format, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { GLOBAL_URL } from "./veriable.global";

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
      extension === "gif" ||
      extension === "webp"
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

export const isFile = (url: any) => {
  console.log(url);
  if(url instanceof File){
    return true;
  }else
  if(url instanceof Object){
    return false;
  }else{
    return true;
  }
};

export const checkUrl = (url: any): string => {
  console.log(url);

  let imageUrl: string;

  if (typeof url === "string") {
    imageUrl = url;
  } else if (url instanceof Object) {
    imageUrl = URL.createObjectURL(url);
  } else {
    return "false";
  }

  return imageUrl;
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

const postCommentApi = async (
  commentToPostDTO: CommentToPostDTO,
  session: User
) => {
  const formData = new FormData();
  formData.append(
    "commentToPostDTO",
    new Blob(
      [
        JSON.stringify({
          content: commentToPostDTO.content,
          postToPost: commentToPostDTO.postToPost,
          userToPost: commentToPostDTO.userToPost,
          userReceive: commentToPostDTO.userReceive,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (commentToPostDTO.listImageofComment) {
    commentToPostDTO.listImageofComment.forEach((file: any, index: any) => {
      formData.append("listImageofComment", file);
    });
  } else {
    formData.append("listImageofComment", "");
  }
  console.log(formData.getAll("listImageofComment"));

  try {
    const response = await fetch(GLOBAL_URL + "/api/comment", {
      method: "POST",
      headers: { authorization: `Bearer ${session?.access_token}` },
      body: formData,
    });

    if (!response.ok) {
      return false;
    }

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error uploading content and files: ", error);
    throw error;
  }
};

export default postCommentApi;

export const postReplyCommentApi = async (
  replyCommentToPostDTO: ReplyCommentToPostDTO,
  session: User
) => {
  const formData = new FormData();
  formData.append(
    "repcommentDTO",
    new Blob(
      [
        JSON.stringify({
          content: replyCommentToPostDTO.content,
          commentToPost: replyCommentToPostDTO.commentToPost.id,
          userToPost: replyCommentToPostDTO.userToPost,
          userReceive: replyCommentToPostDTO.userReceive.userId,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (replyCommentToPostDTO.listImageofComment) {
    replyCommentToPostDTO.listImageofComment.forEach(
      (file: any, index: any) => {
        formData.append("listImageofComment", file);
      }
    );
  } else {
    formData.append("listImageofComment", "");
  }
  console.log(formData.getAll("listImageofComment"));

  try {
    const response = await fetch(
      GLOBAL_URL + "/api/repcomment/" + replyCommentToPostDTO.commentToPost.id,
      {
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
        body: formData,
      }
    );

    if (!response.ok) {
      return false;
    }

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error uploading content and files: ", error);
    throw error;
  }
};
