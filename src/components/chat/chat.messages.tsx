import { Box } from "@mui/material";

const Messsages = () => {
  return (
    <Box sx={{ margin: "16px 0", height: "240px", overflow: "auto" }}>
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
