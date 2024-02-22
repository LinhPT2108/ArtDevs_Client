// witdh of menu
export const DRAWER_WIDTH: number = 200;
export const GLOBAL_URL: string = "http://localhost:8080";
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
