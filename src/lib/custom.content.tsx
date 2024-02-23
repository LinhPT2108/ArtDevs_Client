"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface DrawerOpenContextType {
  drawerOpen: boolean;
  setDrawerOpen: (vaule: boolean) => void;
}

const DrawerContext = createContext<DrawerOpenContextType | undefined>(
  undefined
);
export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  return (
    <DrawerContext.Provider value={{ drawerOpen, setDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a UserProvider");
  }
  return context;
};

interface WidthScreenContextType {
  widthScreen: number;
  setWidthScreen: (vaule: number) => void;
}

const WidthScreenContext = createContext<WidthScreenContextType | undefined>(
  undefined
);
export const WidthScreenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [widthScreen, setWidthScreen] = useState<number>(900);
  return (
    <WidthScreenContext.Provider value={{ widthScreen, setWidthScreen }}>
      {children}
    </WidthScreenContext.Provider>
  );
};

export const useWidthScreen = () => {
  const context = useContext(WidthScreenContext);
  if (!context) {
    throw new Error("Width Screen Context must be used within a UserProvider");
  }
  return context;
};

interface MentorContextType {
  mentorData: MentorInfor[];
  setMentorData: React.Dispatch<React.SetStateAction<MentorInfor[]>>;
}

const MentorContext = createContext<MentorContextType | undefined>(undefined);

export const MentorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mentorData, setMentorData] = useState<MentorInfor[]>([]);

  return (
    <MentorContext.Provider value={{ mentorData, setMentorData }}>
      {children}
    </MentorContext.Provider>
  );
};

export const useMentor = () => {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error("useMentor must be used within a MentorProvider");
  }
  return context;
};
