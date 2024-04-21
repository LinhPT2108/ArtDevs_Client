import { Session, withIronSession } from "next-iron-session";

export default withIronSession(
  async (req: any, res: any) => {
    // Cập nhật thông tin người dùng ở đây
    const updatedUserInfo = { name: "New Name", email: "new@email.com" };

    // Cập nhật session với thông tin mới
    console.log(
      '>>> check req.session.get("user");: ',
      req.session.get("user")
    );
    await req.session.save();

    // Trả về kết quả
    return res.status(200).send("Session updated successfully");
  },
  {
    cookieName: "session",
    password: "process.env.SECRET_COOKIE_PASSWORD",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 tuần
      sameSite: "strict",
      path: "/",
    },
  }
);
