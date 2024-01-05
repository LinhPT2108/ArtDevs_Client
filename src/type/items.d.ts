interface ListItem {
  index: number;
  content: string;
  icon: SvgIconProps;
  bgColor: string;
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
interface Post{
  avatar: SvgIconProps;
  name:string;
  timeCreate:Date;
  content:string;
  image:string[];
  totalLike: number;
  totalComment: number;
}