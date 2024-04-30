import Stomp from "stompjs";
import SockJS from "sockjs-client";

// witdh of menu
export const DRAWER_WIDTH: number = 240;
export const GLOBAL_URL: string = "http://localhost:8080";
export const GLOBAL_URL_SOCKET: string = "/wss";
export const GLOBAL_NOTIFI: string = "/app/send-notification";
export const GLOBAL_SEND_MESSAGE: string = "/app/send-message";
export const GLOBAL_SEND_IMAGE: string = "/app/image";
export const GLOBAL_SEND_FRIEND: string = "/app/send-friend";

export const GLOBAL_UPLOAD_POST_MESSAGE: string = "Đăng bài viết thành công";
export const GLOBAL_UPDATE_POST_MESSAGE: string = "Cập Nhật bài viết thành công";
export const GLOBAL_REPORT_POST: string = "Báo cáo bài viết thành công";
export const GLOBAL_SHARE_MESSAGE: string = "Chia sẻ thành công";
export const GLOBAL_UPDATE_MESSAGE: string = "Cập nhật thành công";
export const GLOBAL_DELETE_COMMENT_MESSAGE: string = "Xóa bình luận thành công";
export const GLOBAL_DELETE_POST_MESSAGE: string = "Xóa bài viết thành công";
export const GLOBAL_DELETE_POST_SHARE_MESSAGE: string = "Xóa bài viết đã chia sẻ thành công";
export const GLOBAL_ERROR_MESSAGE: string = "Có lỗi xảy ra !";
export const GLOBAL_BG: string = "#fff";
export const GLOBAL_BG_NAV: string = "#f5f5f5";
export const GLOBAL_COLOR_NAV: string = "#adb5bd";
export const GLOBAL_COLOR_HEADER: string = "#1c4aa7";
export const GLOBAL_BG_NOTIFY: string = "#e6e6e6";
export const GLOBAL_BG_BLUE_300: string = "#0e56c9";
export const GLOBAL_BG_BLUE_900: string = "#315ca1";
export const GLOBAL_BG_RED_300: string = "#d31c1c";
export const GLOBAL_BG_RED_900: string = "#cf0000";
export const GLOBAL_COLOR_NOTIFY: string = "#000";
export const GLOBAL_COLOR_BLACK: string = "#000";
export const GLOBAL_COLOR_WHITE: string = "#fff";
export const GLOBAL_COLOR_MENU: string = "#323235";
export const GLOBAL_BOXSHADOW: string = "0 0 3px 1px #8080803b";
export const GLOBAL_TURNON_MENTOR: string = "turnonmentor";
export const GLOBAL_TURNOFF_MENTOR: string = "turnoffmentor";
export const GLOBAL_LOCKED_ACCOUNT: string = "lockaccount";
export const GLOBAL_UNLOCKED_ACCOUNT: string = "unlockaccount";
export const GLOBAL_LISTALLACCOUNT: string = "listallaccount";
export const GLOBAL_LISTALLBAND: string = "listallband";
export const GLOBAL_LISTMENTOR: string = "listallmentor";
export const GLOBAL_LISTADMIN: string = "listadmin";
export const GLOBAL_LISTUSER: string = "listuser";
export const GLOBAL_LISTNEWUSER: string = "listnewuser";
export const GLOBAL_LISTUSERREPORT1: string = "listuserreport1";
export const GLOBAL_LISTUSERREPORT2: string = "listuserreport2";

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
