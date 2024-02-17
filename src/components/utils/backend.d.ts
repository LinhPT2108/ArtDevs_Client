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
  // interface Post {
  //   avatar: SvgIconProps;
  //   name: string;
  //   timeCreate: Date;
  //   content: string;
  //   image: string[];
  //   totalLike: number;
  //   totalComment: number;
  // }
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
    access_token: string;
    refresh_token: string;
    user: UserLogin;
  }
  interface UserRegister {
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
    confirmPassword: string;
    profilePicUrl?: string;
    provider?: string;
    username: string;
    role: Role;
    dateOfBirth: string;
    gender: string;
    listDemandOfUser?: string[];
    listSkillOfUser?: string[];
  }

  interface Province {
    province_id: number;
    province_name: string;
    province_type: string;
  }
  interface District {
    district_id: number;
    district_name: string;
    district_type: string;
  }
  interface Ward {
    ward_id: number;
    ward_name: string;
    ward_type: string;
  }
  interface Result<T> {
    results: T;
  }
  interface MyLanguageProgram {
    languageName: string;
    id: string;
  }
  interface Role {
    id: number;
    roleName: string;
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
    role: Role;
    dateOfBirth: string;
    gender: string;
    listDemandOfUser?: string[];
    listSkillOfUser?: string[];
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
  interface Post {
    postId: string;
    content: string;
    time: string;
    timelineUserId: string;
    userPost: UserPost;
    listHashtag: Hashtag[];
    listImageofPost: ImageofPost[];
    privacyPostDetails: PostDetails[];
    totalComment: number;
    totalLike: number;
    totalShare: number;
  }
  interface UserPost {
    userId: string;
    username: string;
    profilePicUrl?: string;
  }
  interface Hashtag {
    hashtagDetailName: string;
    id: number;
    postIdByHashTag: string;
  }
  interface ImageofPost {
    id: number;
    cloudinaryPublicId: string;
    imageUrl: string;
    postID: string;
    time: string;
  }
  interface PostDetails {
    createDate: string;
    id: number;
    postId: string;
    privacyPostId: number;
    status: boolean;
  }

  interface AddPost {
    postId: string;
    content: string;
    time: Date;
    timelineUserId: Date;
    userId: string;
    listImageofPost: string[] | null;
    privacyPostDetails: number;
    listHashtag: number[] | null;
  }
}