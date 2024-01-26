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
  handleDemand: (value: Skill[]) => void;
}

const KnowledgeSign = (props: IProps) => {
  const { handleDemand } = props;
  const [selectedTopics, setSelectedTopics] = useState<any>([]);

  const handleTopicChange = (event: any, value: any) => {
    setSelectedTopics(value);
    handleDemand(value);
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
  { languageProgram: "Java Basic", value: 1 },
  { languageProgram: "Java EE", value: 2 },
  { languageProgram: "Java Core", value: 3 },
  { languageProgram: "Java (Spring MVC – Model View Controller)", value: 4 },
  { languageProgram: "Java (Struts)", value: 5 },
  { languageProgram: "Java (Hibernate)", value: 6 },
  { languageProgram: "Java (GWT – Google Web Toolkit)", value: 7 },
  { languageProgram: "Java (Vaadin)", value: 8 },
  { languageProgram: "Java (Wicket)", value: 9 },
  { languageProgram: "Java (Grails)", value: 10 },
  { languageProgram: "Java (Play!)", value: 11 },
  { languageProgram: "Java (Vert.X)", value: 12 },
  { languageProgram: "Java (JSF – JavaServer Faces)", value: 13 },
  { languageProgram: "PHP Basic", value: 14 },
  { languageProgram: "PHP (Lavarel)", value: 15 },
  { languageProgram: "PHP (CodeIgniter)", value: 16 },
  { languageProgram: "PHP (Symfony)", value: 17 },
  { languageProgram: "PHP (Zend)", value: 18 },
  { languageProgram: "PHP (Phalcon)", value: 19 },
  { languageProgram: "PHP (CakePHP)", value: 20 },
  { languageProgram: "PHP (Yii)", value: 21 },
  { languageProgram: "PHP (FuelPHP)", value: 22 },
];
