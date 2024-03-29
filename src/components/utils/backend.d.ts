export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface UserMessage {
    userId: string;
    username: string;
    profilePicUrl: string;
    fullname: string;
    online: boolean;
  }
  interface IUser {
    user: ListItem;
    active: boolean;
    timeActive: Date;
  }
  interface ListItem {
    index: number;
    content: string;
    icon: SvgIconProps;
    bgColor: string;
    url: string;
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
    birthday: string;
    confirmPassword?: string;
    profilePicUrl?: string;
    provider?: string;
    username: string;
    role: Role;
    gender: number;
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
    profileImageUrl?: string;
    provider?: string;
    username: string;
    role: Role;
    birthday: string;
    profileImageUrl: string;
    gender: number;
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

  interface ResponseStatus {
    errorCode: number;
    message: string;
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

  interface ResPost {
    id: number;
    typePost: string;
    fullname: string;
    content: string;
    postId: Post;
  }

  interface Post {
    isProcessingLike: boolean | undefined;
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
    likeByUserLogged: boolean;
    typePost: string;
  }
  interface UserPost {
    userId: string;
    fullname: string;
    profilePicUrl?: string;
    fullname: string;
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
    namePrivacy?: string;
    status: boolean;
  }

  interface AddPost {
    postId: string;
    content: string;
    userId: string;
    time: Date;
    timelineUserId: Date;
    listImageofPost: File[] | null;
    privacyPostDetails: number;
    listHashtag: string[] | null;
  }

  interface UpdatePost {
    postId: string;
    content: string;
    time: Date;
    timelineUserId: Date;
    userId: string;
    listImageofPost: File[] | null;
    privacyPostDetails: number;
    listHashtag: HashtagInfor[];
  }

  interface MentorInfor {
    userId: string;
    content: string;
    listSkillOfMentor: string[];
    gender: integer;
    isOnline: boolean;
    isReady: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    priceMatch: number;
    role: Role;
    BackgroundImageUrl: string;
    profilePicUrl: string;
  }

  interface HashtagInfor {
    id: number;
    hashtagText: string;
    countHashtagOfDetail: number;
  }
  // interface CommentToPostDTO {
  //   content: string;
  //   userToPost: string;
  //   postToPost: string;
  // }

  interface CommentToPostDTO {
    // id:number
    content: string;
    listImageofComment: any;
    userToPost: string;
    postToPost: string;
    userReceive: string;
  }
  interface CommentOfPost {
    id: number;
    content: string;
    timeComment: string;
    listImageofComment: string[] | null;
    listReplyComment: ListReplyComment[] | null;
    userID: UserPost;
  }

  interface ReplyCommentToPostDTO {
    content: string;
    listImageofComment: any;
    commentToPost: any;
    userToPost: string;
    userReceive: UserPost;
  }

  interface ListReplyComment {
    id: number;
    content: string;
    timeComment: string;
    listPictureOfComment: any[] | null;
    commentId: number;
    userID: UserPost;
    userReceiveDto: UserPost;
  }

  interface Relation {
    id: string;
    userAction: UserAction;
    userID2: string;
    userID1: string;
    timeRelation: string;
  }
  interface UserAction {
    userId: string;
    username: string;
    profilePicUrl: string;
    fullname: string;
    userReceiveDto: UserPost;
  }

  interface notificationToPostDTO {
    message: string;
    receiverId: string;
    senderId: string;
    type: string;
    postId: string;
    shareId: string;
  }

  interface notificationToGetDTO {
    id: number;
    message: string;
    receiverId: UserPost;
    senderId: UserPost;
    type: string;
    postId: string;
    shareId: string;
    createDate: Date;
    read: boolean;
  }
  interface ReponseError {
    errorCode: number;
    message: string;
  }

  interface ReponseSendCode {
    statusCode: number;
    message: string;
    model: Verification;
  }

  interface Verification {
    email: string;
    verificationCode: number;
  }
}
