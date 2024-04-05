
import Stomp from "stompjs";
import SockJS from "sockjs-client";

// witdh of menu
export const DRAWER_WIDTH: number = 200;
export const GLOBAL_URL: string = "http://localhost:8080";
export const GLOBAL_NOTIFI: string = "/app/send-notification";
export const GLOBAL_SEND_MESSAGE: string = "/app/send-message";
export const GLOBAL_SEND_IMAGE: string = "/app/image";

export const GLOBAL_UPLOAD_POST_MESSAGE: string = "Đăng bài viết thành công";
export const GLOBAL_REPORT_POST: string = "Báo cáo bài viết thành công";
export const GLOBAL_SHARE_MESSAGE: string = "Chia sẻ thành công";
export const GLOBAL_DELETE_COMMENT_MESSAGE: string = "Xóa bình luận thành công";
export const GLOBAL_DELETE_POST_MESSAGE: string = "Xóa bài viết thành công";
export const GLOBAL_ERROR_MESSAGE: string = "Có lỗi xảy ra !";
//open menu
let drawerOpen: boolean = true;

// const socket = new SockJS("http://localhost:8080/ws");
// export const stompClient = Stomp.over(socket);

export const getDrawerOpen = (): boolean => {
  return drawerOpen;
};

export const setDrawerOpen = (newValue: boolean): void => {
  drawerOpen = newValue;
};

export const handleDrawerOpen = (openContact: boolean) => {
  setDrawerOpen(openContact);
};

// value tab nav header and bottom
let valueTab: number = 0;

export const getValueTab = (): number => {
  return valueTab;
};

export const setValueTab = (newValue: number): void => {
  valueTab = newValue;
};

export const handleValueTab = (newValue: number) => {
  setValueTab(newValue);
};

// check login
let globalUser: User | null = null;

export const setGlobalUser = (user: User | null): void => {
  globalUser = user;
};

export const getGlobalUser = (): User | null => {
  return globalUser;
};
