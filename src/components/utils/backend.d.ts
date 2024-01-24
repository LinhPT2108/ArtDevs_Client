export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface ListItem {
    index: number;
    content: string;
    icon: SvgIconProps;
    bgColor: string;
    url: string;
  }
  interface IUser {
    user: ListItem;
    active: boolean;
    timeActive: Date;
  }
  interface MessageExample {
    primary: string;
    secondary: string;
    person: string;
  }
  interface AccountExample {
    avatar: SvgIconProps;
    name: string;
    manualFriend: string;
  }
  interface Post {
    avatar: SvgIconProps;
    name: string;
    timeCreate: Date;
    content: string;
    image: string[];
    totalLike: number;
    totalComment: number;
  }
  interface MessageContent {
    content: String;
    image?: any;
    from: String;
    to: String;
  }
  interface IColor {
    bgColor: string;
    textColor: string;
  }

  interface User {
    name: string;
    email: string;
    image: string;
  }
  interface Skill {
    language: string;
  }

  interface UserLogin {
    userId: string;
    city: string;
    district: string;
    ward: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    isOnline: boolean;
    password: string;
    profilePicUrl?: string;
    provider?: string;
    username: string;
    role: {
      id: number;
      roleName: string;
    };
    listDemandOfUser?: Skill[];
    listSkillOfUser?: Skill[];
    listMethod?: any;
    userTransition1?: any;
    userTransition2?: any;
    listPostOfUser?: any;
    userRelation1?: any;
    userRelation2?: any;
    userAction?: any;
    userForm?: any;
    userTo?: any;
    listLike?: any;
    listShare?: any;
    listReport?: any;
    listComment?: any;
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    delete: boolean;
    backgroundImageUrl?: string;
    creadentialsNonExprired: boolean;
  }
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    userdto?: T;
    token: string;
    refeshToken: string;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
}
