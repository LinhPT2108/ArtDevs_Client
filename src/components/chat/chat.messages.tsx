import { Box, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { formatDateString } from "../utils/utils";

interface IPros {
  preViewImage: boolean;
  pageUrl: string;
  dataMessage: MessageContent[] | null;
  session: User;
}
const Messsages = (pros: IPros) => {
  const { preViewImage, pageUrl, dataMessage, session } = pros;
  console.log("render mess");

  if (!dataMessage) {
    return (
      <Box
        sx={{
          margin: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: `${
            pageUrl === "home"
              ? !preViewImage
                ? "274px"
                : "200px"
              : !preViewImage
              ? "88%"
              : "79%"
          }`,
          overflow: "auto",
          "::-webkit-scrollbar": {
            width: "5px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#4CAF50",
            borderRadius: "4px",
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        margin: "0",
        height: `${
          pageUrl === "home"
            ? !preViewImage
              ? "274px"
              : "200px"
            : !preViewImage
            ? "88%"
            : "79%"
        }`,
        overflowY: "auto",
        "::-webkit-scrollbar": {
          width: "5px",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#4CAF50",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        maxWidth: "100%",
      }}
    >
      {dataMessage?.map((_e: MessageContent, _index: number) => {
        return (
          <Box
            key={`message-${_index}`}
            sx={{
              width: "100%",
            }}
          >
            {_e.formUserId == session?.user.userId ? (
              <Box
                sx={{
                  display: "flex",
                  margin: "16px",
                }}
              >
                <Tooltip
                  title={formatDateString(_e.timeMessage.toString())}
                  placement="left"
                  arrow
                >
                  <Box
                    sx={{
                      backgroundColor: "orange",
                      borderRadius: "30px 30px 30px 0",
                      color: "black",
                      maxWidth: "100%",
                      padding: "10px 20px",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {_e.message}
                  </Box>
                </Tooltip>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  margin: "16px",
                  justifyContent: "flex-end",
                }}
              >
                <Tooltip
                  title={formatDateString(_e.timeMessage)}
                  placement="left"
                >
                  <Box
                    sx={{
                      backgroundColor: "aqua",
                      borderRadius: "30px 30px 0 30px",
                      color: "black",
                      maxWidth: "100%",
                      padding: "10px 20px",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {_e.message}
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Messsages;
