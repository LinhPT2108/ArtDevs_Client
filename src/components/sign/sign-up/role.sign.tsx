import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import {
  GLOBAL_BG_NAV,
  GLOBAL_BG_NOTIFY,
} from "@/components/utils/veriable.global";

interface TruncatedTextProps {
  text: string;
  maxLines: number;
}

const TruncatedText = (props: TruncatedTextProps) => {
  const { text, maxLines } = props;
  return (
    <div style={{ overflow: "hidden", maxHeight: maxLines * 1.4 + "em" }}>
      {text}
    </div>
  );
};

interface IProps {
  roleName: string;
  handleRole: (value: Role) => void;
}

const CustomRadioInput = (props: IProps) => {
  const { roleName, handleRole } = props;
  const [selectedValue, setSelectedValue] = React.useState(roleName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = (event.target as HTMLInputElement).value;
    setSelectedValue(value);
    if (value === "user") {
      handleRole({ id: 2, roleName: value });
    } else {
      handleRole({ id: 3, roleName: value });
    }
  };
  const studentDescription =
    "Chia sẻ Kinh Nghiệm Học Tập: Bài viết chia sẻ về các mô hình học tập hiệu quả. Kinh nghiệm làm bài tập, ôn tập cho kỳ thi. Các gợi ý và chiến lược quản lý thời gian học tập.Tư Vấn Nghề Nghiệp và Hướng Nghiệp:Thảo luận về sự lựa chọn ngành học và sự phù hợp với sở thích và mục tiêu cá nhân. Gợi ý về việc xây dựng sự nghiệp sau khi tốt nghiệp. Chia sẻ thông tin về các sự kiện, hội thảo nghề nghiệp.";
  const mentorDescription =
    "Tìm Kiếm Mentor: Tạo chủ đề để mô tả mục tiêu học tập và sự cần đến mentor. Mô tả lợi ích từ việc có một mentor hỗ trợ. Kinh Nghiệm Hợp Tác với Mentor: Chia sẻ kinh nghiệm làm việc với mentor, cách tìm kiếm và lựa chọn một mentor. Mô tả cách mentor đã hỗ trợ trong việc phát triển sự nghiệp và kiến thức. Góp Ý và Thảo Luận về Mentorship: Đề cập đến những thách thức mà bạn gặp khi tìm kiếm mentor và cách vượt qua chúng. Góp ý về cách cải thiện chương trình mentorship trường học hoặc tổ chức.";

  const defaultMaxLines = 5;
  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: { xs: 18, sm: 24 },
          marginBottom: "12px",
        }}
      >
        Hãy chọn vai trò của bạn
      </FormLabel>
      <RadioGroup
        row
        aria-label="role-sign"
        name="role-sign"
        value={selectedValue}
        onChange={handleChange}
        sx={{ width: "100%", justifyContent: "space-evenly" }}
      >
        <FormControlLabel
          value="user"
          control={<Radio />}
          sx={{
            position: "relative",
            mx: 0,
            height: "100%",
            "& .MuiRadio-root": {
              position: "absolute",
              top: 0,
              right: 0,
            },
          }}
          label={
            <Card
              sx={{
                backgroundColor: `${
                  selectedValue == "user" ? "#f5f5f5" : "#fff"
                }`,
                boxShadow: `${
                  selectedValue == "user" ? "#1976d2 0px 5px 15px" : "none"
                }`,
                "@media (min-width: 0px)": {
                  maxWidth: "240px",
                },
                "@media (min-width: 310px)": {
                  maxWidth: "270px",
                },
                "@media (min-width: 340px)": {
                  maxWidth: "330px",
                },
                "@media (min-width: 400px)": {
                  maxWidth: "380px",
                },
                "@media (min-width: 480px)": {
                  maxWidth: "450px",
                },
                "@media (min-width: 600px)": {
                  maxWidth: "240px",
                },
                "@media (min-width: 768px)": {
                  maxWidth: "320px",
                },
                "@media (min-width: 900px)": {
                  maxWidth: "360px",
                },
                "@media (min-width: 1023px)": {
                  maxWidth: "440px",
                },
              }}
            >
              <CardMedia
                sx={{
                  height: 280,
                  "@media (min-width: 0px)": {
                    maxWidth: "240px",
                  },
                  "@media (min-width: 310px)": {
                    maxWidth: "270px",
                  },
                  "@media (min-width: 340px)": {
                    maxWidth: "330px",
                  },
                  "@media (min-width: 400px)": {
                    maxWidth: "380px",
                  },
                  "@media (min-width: 480px)": {
                    maxWidth: "450px",
                  },
                  "@media (min-width: 600px)": {
                    maxWidth: "240px",
                  },
                  "@media (min-width: 768px)": {
                    maxWidth: "320px",
                  },
                  "@media (min-width: 900px)": {
                    maxWidth: "360px",
                  },
                  "@media (min-width: 1023px)": {
                    maxWidth: "440px",
                  },
                }}
                image="/share-it.webp"
                title="share-it.webp"
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography gutterBottom variant="h5" component="div">
                  Học viên
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "justify",
                    lineHeight: "1.4",
                    maxHeight: defaultMaxLines * 1.4 + "em",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: defaultMaxLines,
                  }}
                >
                  {studentDescription}
                </Typography>
              </CardContent>
            </Card>
          }
        />
        <FormControlLabel
          value="mentor"
          control={<Radio />}
          sx={{
            position: "relative",
            mx: 0,
            height: "100%",
            mt: { xs: 2, sm: 0 },
            "& .MuiRadio-root": {
              position: "absolute",
              top: 0,
              right: 0,
            },
          }}
          label={
            <Card
              sx={{
                backgroundColor: `${
                  selectedValue == "mentor" ? "#f5f5f5" : "#fff"
                }`,
                boxShadow: `${
                  selectedValue == "mentor" ? "#1976d2 0px 5px 15px" : "none"
                }`,
                "@media (min-width: 0px)": {
                  maxWidth: "240px",
                },
                "@media (min-width: 310px)": {
                  maxWidth: "270px",
                },
                "@media (min-width: 340px)": {
                  maxWidth: "330px",
                },
                "@media (min-width: 400px)": {
                  maxWidth: "380px",
                },
                "@media (min-width: 480px)": {
                  maxWidth: "450px",
                },
                "@media (min-width: 600px)": {
                  maxWidth: "240px",
                },
                "@media (min-width: 768px)": {
                  maxWidth: "320px",
                },
                "@media (min-width: 900px)": {
                  maxWidth: "360px",
                },
                "@media (min-width: 1023px)": {
                  maxWidth: "440px",
                },
              }}
            >
              <CardMedia
                sx={{
                  height: 280,
                  "@media (min-width: 0px)": {
                    maxWidth: "240px",
                  },
                  "@media (min-width: 310px)": {
                    maxWidth: "270px",
                  },
                  "@media (min-width: 340px)": {
                    maxWidth: "330px",
                  },
                  "@media (min-width: 400px)": {
                    maxWidth: "380px",
                  },
                  "@media (min-width: 480px)": {
                    maxWidth: "450px",
                  },
                  "@media (min-width: 600px)": {
                    maxWidth: "240px",
                  },
                  "@media (min-width: 768px)": {
                    maxWidth: "320px",
                  },
                  "@media (min-width: 900px)": {
                    maxWidth: "360px",
                  },
                  "@media (min-width: 1023px)": {
                    maxWidth: "440px",
                  },
                }}
                image="/Capture-1.jpg"
                title="green iguana"
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography gutterBottom variant="h5" component="div">
                  Giảng viên
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "justify",
                    lineHeight: "1.4",
                    maxHeight: defaultMaxLines * 1.4 + "em",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: defaultMaxLines,
                  }}
                >
                  {mentorDescription}
                </Typography>
              </CardContent>
            </Card>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadioInput;
