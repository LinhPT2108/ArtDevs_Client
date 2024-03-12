import { Button } from "@mui/material";

<div>
    
  const handleOpen3 = (
    index: number,
    event: React.MouseEvent<HTMLElement>,
    isCmt: boolean
  ) => {
    console.log(isCmt);
    const newOpenArray = isCmt
      ? [...openArray]
      : ([...openArrayReply] as boolean[]);
    newOpenArray[index] = true;
    const newAnchorElArray = isCmt
      ? [...anchorElArray]
      : [...anchorElArrayReply];
    newAnchorElArray[index] = event.currentTarget;
    if (isCmt) {
      setOpenArray(newOpenArray as []);
      setAnchorElArray(newAnchorElArray);
    } else {
      setOpenArrayReply(newOpenArray as []);
      setAnchorElArrayReply(newAnchorElArray);
    }
  };

  <Button
    id={`option-button-${index}`}
    aria-controls={openArray[index] ? `option-menu-${index}` : undefined}
    aria-haspopup="true"
    aria-expanded={openArray[index] ? "true" : undefined}
    onClick={(event) => handleOpen3(index, event, true)}
    sx={{ p: "0px", minWidth: "0px" }}
  >
    <MoreVertIcon />
  </Button>
  <Menu
    id={`option-menu-${index}`}
    anchorEl={anchorElArray[index]}
    open={openArray[index]}
    onClose={() => handleClose3(index, true)}
    MenuListProps={{
      "aria-labelledby": `option-button-${index}`,
    }}
  >
    <MenuItem onClick={() => handleEditCommentOrReplyComment(c, true, index)}>
      Chỉnh sửa
    </MenuItem>
    <MenuItem
      onClick={
        () => handleClickOpenAlerts(c, "deleteCmt", true, index, false)
      }
    >
      Xóa bình luận
    </MenuItem>
  </Menu>
</div>;
