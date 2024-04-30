"use client";
import { Box, Grid, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState } from "react";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface IProps {
  handleListSkillOfUser: (value: MyLanguageProgram[], userId: String) => void;
  programingLanguage: MyLanguageProgram[] | undefined;
  userId: String | undefined;
  messageDemand: string;
  errorDemand: boolean;
}

const SkillMentor = ({
  handleListSkillOfUser,
  userId,
  programingLanguage,
  messageDemand,
  errorDemand,
}: IProps) => {
  const [listSkillOfMentor, setListSkillOfMentor] = useState<String[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<any>(
    listSkillOfMentor?.length
      ? programingLanguage?.filter((pl) =>
          listSkillOfMentor.includes(pl.languageName)
        ) || []
      : []
  );

  // Thêm từ khóa async trước khi định nghĩa hàm
  const fetchData = async () => {
    try {
      const response = await sendRequest<ReponseListSkillOfMentor>({
        url: `${GLOBAL_URL}/api/get-skill-mentor`,
        method: "GET",
        queryParams: { userId },
      });
      setListSkillOfMentor(response.model);
    } catch (error) {
      // Xử lý lỗi ở đây
    }
  };

  // Gọi hàm fetchData
  fetchData();
  const handleTopicChange = (event: any, value: any) => {
    setSelectedTopics(value);
    if (userId !== undefined) {
      handleListSkillOfUser(value, userId);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          fontWeight: 700,
          fontSize: { xs: 18, sm: 24 },
          marginBottom: "12px",
        }}
      >
        Cập nhật Kỹ Năng Cho Người Hướng dẫn
        <Typography
          component={"p"}
          sx={{
            fontSize: "14px",
          }}
        >
          (sắp xếp theo độ ưu tiên giảm dần)
        </Typography>
        {errorDemand && (
          <Typography
            component={"p"}
            sx={{
              fontSize: "14px",
              color: "red",
            }}
          >
            {messageDemand}
          </Typography>
        )}
      </Box>
      <Grid columns={2} spacing={2} container>
        <Grid item xs={2}>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={programingLanguage ? programingLanguage : []}
            disableCloseOnSelect
            getOptionLabel={(option) => option.languageName}
            value={selectedTopics}
            onChange={handleTopicChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.languageName}
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Chủ đề" placeholder="Kỹ năng" />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillMentor;
