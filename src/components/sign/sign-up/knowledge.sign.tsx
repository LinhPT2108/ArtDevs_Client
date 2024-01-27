import { Box, Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface IProps {
  role: Role;
  handleListDemandOfUser: (value: MyLanguageProgram[] | undefined) => void;
  handleListSkillOfUser: (value: MyLanguageProgram[] | undefined) => void;
}

const KnowledgeSign = (props: IProps) => {
  const { role, handleListDemandOfUser, handleListSkillOfUser } = props;
  const [selectedTopics, setSelectedTopics] = useState<any>([]);

  const handleTopicChange = (event: any, value: any) => {
    setSelectedTopics(value);
    if (role.roleName === "user") {
      handleListDemandOfUser(value);
      handleListSkillOfUser(undefined);
    } else {
      handleListDemandOfUser(undefined);
      handleListSkillOfUser(value);
    }
  };
  console.log(">>> check topics ", selectedTopics);

  return (
    <Box>
      <Box sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}>
        Chọn chủ đề bạn quan tâm
      </Box>
      <Grid columns={2} spacing={2} container>
        <Grid item xs={2}>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={languagePrograms}
            disableCloseOnSelect
            getOptionLabel={(option) => option.languageProgram}
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
                {option.languageProgram}
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Chủ đề" placeholder="Favorites" />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default KnowledgeSign;

const languagePrograms = [
  { languageProgram: "Java", value: "Java" },
  { languageProgram: "Java EE", value: "Java" },
  { languageProgram: "Java Core", value: "Java" },
  {
    languageProgram: "Java (Spring MVC – Model View Controller)",
    value: "Java",
  },
  { languageProgram: "Java (Struts)", value: "Java" },
  { languageProgram: "Java (Hibernate)", value: "Java" },
  { languageProgram: "Java (GWT – Google Web Toolkit)", value: "Java" },
  { languageProgram: "Java (Vaadin)", value: "Java" },
  { languageProgram: "Java (Wicket)", value: "Java" },
  { languageProgram: "Java (Grails)", value: "Java" },
  { languageProgram: "Java (Play!)", value: "Java" },
  { languageProgram: "Java (Vert.X)", value: "Java" },
  { languageProgram: "Java (JSF – JavaServer Faces)", value: "Java" },
  { languageProgram: "PHP Basic", value: "Java" },
  { languageProgram: "PHP (Lavarel)", value: "Java" },
  { languageProgram: "PHP (CodeIgniter)", value: "Java" },
  { languageProgram: "PHP (Symfony)", value: "Java" },
  { languageProgram: "PHP (Zend)", value: "Java" },
  { languageProgram: "PHP (Phalcon)", value: "Java" },
  { languageProgram: "PHP (CakePHP)", value: "Java" },
  { languageProgram: "PHP (Yii)", value: "Java" },
  { languageProgram: "PHP (FuelPHP)", value: "Java" },
];
