import { DateValues } from "date-fns";

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
    messageId: string;
    relationShipId: boolean;
    pictureOfMessages: any[];
    timeMessage: string;
    subject: string;
    content: string;
    formUserId: string;
    toUserId: string;
  }

  interface MessageContentToPost {
    messageId: string;
    pictureOfMessages: any;
    subject: string;
    content: string;
    formUser: string;
    toUser: string;
    timeMessage: Date;
  }

  interface pictureOfMessageDTOs {
    cloudinaryPublicId: string;
    size: string;
    url: string;
    messageId: string;
    id: number;
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
    id: number;
    countUserOfLanguage: number;
    countMentorOfLanguage: number;
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
    gender: number;
    status?: number;
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
    id: string;
    typePost: string;
    userPostDto: UserPost;
    content: string;
    postId: Post;
    timeCreate: string;
    totalLike: number;
    totalComment: number;
    likeByUserLogged: boolean;
    isProcessingLike: boolean | undefined;
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
    roleName: string;
  }
  interface Hashtag {
    hashtagDetailName: string;
    id: number;
    postIdByHashTag: string;
  }
  interface ImageofPost {
    // id: number;
    cloudinaryPublicId: string;
    imageUrl: string;
    postID: string;
    time: string;
    valid: boolean;
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
    // listImageofPost: File[] | null;
    listImageofPost: ImageofPost[] | null;
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
    online: boolean;
    isReady: boolean;
    fullname: string;
    priceMatch: number;
    role: Role;
    BackgroundImageUrl: string;
    profilePicUrl: string;
    sendStatus: boolean;
  }

  interface HashtagInfor {
    id: number;
    hashtagText: string;
    description: string;
    totalPostUseHashtag: number;
    timeCreate: string;
    isDel: Boolean;
    report: number;
    userAction: UserPost;
  }
  interface ReponseHashtagInfor {
    statusCode: number;
    message: string;
    model: HashtagInfor;
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

  interface ListReplyCommentOfShare {
    id: number;
    content: string;
    timeComment: string;
    listPictureOfComment: any[] | null;
    commentId: number;
    userID: UserPost;
    userReceiveDto: UserPost;
  }

  interface CommentOfShareToGetDTO {
    id: number;
    content: string;
    listImageofComment: string[];
    timeComment: string;
    userID: UserPost;
    userReceiveDto: UserPost;
    listReplyComment: ListReplyComment[] | null;
  }
  interface CommentOfShareToPostDTO {
    listImageofComment: any;
    content: string;
    userToPost: string;
    userReceive: string;
    shareId: string;
  }
  interface ListReplyComment {
    id: number;
    content: string;
    timeComment: string;
    listPictureOfComment: any[] | null;
    commentId: number;
    userAction: UserPost;
    userReceiveDto: UserPost;
  }
  interface Relation {
    id: string;
    userAction: UserAction;
    userID2: string;
    userID1: string;
    timeRelation: string;
  }

  interface RelationNotificationDTO {
    userAction: string;
    userReceive: string;
    createDate: Date;
    typeRelation: boolean;
  }

  interface RelaNotiDTO {
    userAction: UserPost;
    userReceive: string;
    createDate: Date;
    typeRelation: boolean;
  }

  interface UserAction {
    userId: string;
    username: string;
    profilePicUrl: string;
    fullname: string;
    userReceiveDto: UserPost;
    sendStatus: boolean;
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
  interface ReportDTO {
    reportDetail: string;
    postId: string;
  }
  
  interface ReponseReportFormAdmin {
    statusCode: number;
    message: string;
    model: ReportListDTO;
  }
  interface ReponseHashtagFormAdmin {
    statusCode: number;
    message: string;
    model: HashtagInfor[];
  }
  interface ReponseLangugeFormAdmin {
    statusCode: number;
    message: string;
    model: MyLanguageProgram[];
  }
  interface ReponseFeedbackFormAdmin {
    statusCode: number;
    message: string;
    model: FeedbackDTO[];
  }
  interface ReponseListSkillOfMentor {
    statusCode: number;
    message: string;
    model: string[];
  }
  interface RequestUserUpdateFormAdmin {
    statusCode: number;
    message: string;
    model: UserFormAdminDTO;
  }

  interface ReponseAllUserFormAdmin {
    statusCode: number;
    message: string;
    model: AccountListDTO;
  }
  interface ReponseCountAllUserFormAdmin {
    statusCode: number;
    message: string;
    model: CountAccountDTO;
  }
  interface CountAccountDTO {
    listBand: number;
    listMentor: number;
    listUser: number;
    listNewMentor: number;
    listAllAccount: number;
    listNewUser: number;
    listAdmin: number;
  }
  interface ReponseReportFormAdmin {
    statusCode: number;
    message: string;
    model: ReportListDTO;
  }

  interface ReportListDTO {
    listNewReport: Report[];
    listReport: Report[];
    listUserReport1: UserFormAdminDTO[];
    listUserReport2: UserFormAdminDTO[];
    listUserReport3: UserFormAdminDTO[];
    listPostisDel: Post[];
  }
  interface Report {
    id: number;
    reportDetail: string;
    reportPostId: string;
    reportUserId: string;
    timeReport: Date;
    userIdActionReport: string;
  }
  interface AccountListDTO {
    listBand: UserFormAdminDTO[];
    listAllAccount: UserFormAdminDTO[];
    listMentor: UserFormAdminDTO[];
    listUser: UserFormAdminDTO[];
    listAdmin: UserFormAdminDTO[];
  }

  interface UserFormAdminDTO {
    email: string;
    role: Role;
    fullname: string;
    createDate: Date;
    accountNonLocked: boolean;
    userPictureAvatar: string;
    userPictureBackground: string;
    totalFriend: number;
    totalPost: number;
    totalReport: number;
    userId: string;
  }

  interface Reponse<T> {
    statusCode: number;
    message: string;
    model: Feedback;
  }

  interface Feedback {
    id: number;
    title: string;
    content: string;
    createFeedback: Date;
    dateHandle: Date | null;
    status: boolean;
    user: UserLogin;
    listImage: File[] | null;
    type: string;
  }
  interface ImageofFeedback {
    id: number;
    cloudinaryPublicId: string;
    imageOfFeedbackUrl: string;
    time: string;
  }
  interface Demand {
    id: number;
    description: string;
    desiredTime: string;
    priority: number;
    programingLanguage: string;
  }
  interface FeedbackDTO {
    id: number;
    title: string;
    content: string;
    createFeedback: Date;
    dateHandle: Date | null;
    status: boolean;
    userId: string;
    listImage: ImageofFeedback[] | null;
  }

  interface LogDTO {
    id: number;
    action: string;
    receiver: UserPost;
    postId: string;
    shareId: string;
    content: string;
    timeLog: string;
    userPostDTO: UserPost;
  }
}
