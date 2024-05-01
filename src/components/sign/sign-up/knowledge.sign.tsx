import { Box, Grid, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface IProps {
  programingLanguage: MyLanguageProgram[];
  role: Role | undefined;
  handleListDemandOfUser: (value: MyLanguageProgram[]) => void;
  handleListSkillOfUser: (value: MyLanguageProgram[]) => void;
  data: UserRegister | UserLogin;
  messageDemand: string;
  errorDemand: boolean;
}

const KnowlegdeSign = (props: IProps) => {
  const {
    errorDemand,
    messageDemand,
    programingLanguage,
    role,
    handleListDemandOfUser,
    handleListSkillOfUser,
    data,
  } = props;
  const [selectedTopics, setSelectedTopics] = useState<any>(
    programingLanguage.filter((pl) =>
      data?.listDemandOfUser?.includes(pl.languageName)
    ) ||
      programingLanguage.filter((pl) =>
        data?.listSkillOfUser?.includes(pl.languageName)
      ) ||
      []
  );

  const handleTopicChange = (event: any, value: any) => {
    setSelectedTopics(value);
    if (role?.roleName === "user") {
      handleListDemandOfUser(value);
      console.log(">>> check value: ", value);
      handleListSkillOfUser([]);
    } else {
      handleListDemandOfUser([]);
      handleListSkillOfUser(value);
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
        Chọn chủ đề bạn quan tâm
        {/* <Typography
          component={"p"}
          sx={{
            fontSize: "14px",
          }}
        >
          (sắp xếp theo độ ưu tiên giảm dần)
        </Typography> */}
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
              <TextField
                {...params}
                label="Chủ đề"
                placeholder="Hãy chọn chủ đề quan tâm"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default KnowlegdeSign;
