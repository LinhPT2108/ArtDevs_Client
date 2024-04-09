// witdh of menu
export const DRAWER_WIDTH: number = 200;
export const GLOBAL_URL: string = "http://localhost:8080";
export const GLOBAL_NOTIFI: string = "/app/send-notification";

export const GLOBAL_UPLOAD_POST_MESSAGE: string = "Đăng bài viết thành công";
export const GLOBAL_SHARE_MESSAGE: string = "Chia sẻ thành công";
export const GLOBAL_DELETE_COMMENT_MESSAGE: string = "Xóa bình luận thành công";
export const GLOBAL_DELETE_POST_MESSAGE: string = "Xóa bài viết thành công";
export const GLOBAL_ERROR_MESSAGE: string = "Có lỗi xảy ra !";
export const GLOBAL_TURNON_MENTOR: string = "turnonmentor";
export const GLOBAL_TURNOFF_MENTOR: string = "turnoffmentor";
export const GLOBAL_LOCKED_ACCOUNT: string = "lockaccount";
export const GLOBAL_UNLOCKED_ACCOUNT: string = "unlockaccount";
export const GLOBAL_LISTALLACCOUNT: string = "listallaccount";
export const GLOBAL_LISTALLBAND: string = "listallband";
export const GLOBAL_LISTMENTOR: string = "listallmentor";
export const GLOBAL_LISTNEWMENTOR: string = "listnewmentor";
export const GLOBAL_LISTUSER: string = "listuser";
export const GLOBAL_LISTNEWUSER: string = "listnewuser";
export const GLOBAL_LISTUSERREPORT1: string = "listuserreport1";
export const GLOBAL_LISTUSERREPORT2: string = "listuserreport2";

//open menu
let drawerOpen: boolean = true;

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
