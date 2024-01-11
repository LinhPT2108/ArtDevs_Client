import { Box } from "@mui/material";
interface IPros {
  preViewImage: boolean;
}
const Messsages = (pros: IPros) => {
  const { preViewImage } = pros;
  return (
    <Box
      sx={{
        margin: "0",
        height: `${!preViewImage ? "274px" : "200px"}`,
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
      <Box sx={{ display: "flex", margin: "16px" }}>
        <Box
          sx={{
            backgroundColor: "orange",
            borderRadius: "30px 30px 30px 0",
            color: "back",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          Hi you ?
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "16px" }}>
        <Box
          sx={{
            backgroundColor: "aqua",
            borderRadius: "30px 30px 0 30px",
            color: "back",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          Hi you, how are you today ?{/* and current, where do you live ? */}
        </Box>
      </Box>
      <Box sx={{ display: "flex", margin: "16px" }}>
        <Box
          sx={{
            backgroundColor: "orange",
            borderRadius: "30px 30px 30px 0",
            color: "back",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          Hi you ?
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "16px" }}>
        <Box
          sx={{
            backgroundColor: "aqua",
            borderRadius: "30px 30px 0 30px",
            color: "back",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          Hi you, how are you today ?{/* and current, where do you live ? */}
        </Box>
      </Box>
      <Box sx={{ display: "flex", margin: "16px" }}>
        <Box
          sx={{
            backgroundColor: "orange",
            borderRadius: "30px 30px 30px 0",
            color: "back",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          Hi you ?
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "16px" }}>
        <Box
          sx={{
            backgroundColor: "aqua",
            borderRadius: "30px 30px 0 30px",
            color: "back",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          Hi you, how are you today ?{/* and current, where do you live ? */}
        </Box>
      </Box>
    </Box>
  );
};

export default Messsages;
