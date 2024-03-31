"use client";
import Card from "@/components/admin/card";
import { sendRequest } from "@/components/utils/api";
import { calculateHoursDifference } from "@/components/utils/utils";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
} from "@mui/material";
import { useState } from "react";
import useSWR, { SWRResponse } from "swr";

interface ip {
  user: UserFormAdminDTO;
  handlepropdata: (userupdate: UserFormAdminDTO) => void;
}
const Banner = (ip: ip) => {
  const { user, handlepropdata } = ip;
  const [updatedUser, setUser] = useState<UserFormAdminDTO | null>(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openStatusChangeDialog, setOpenStatusChangeDialog] = useState(false);

  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true);
  };

  // Function to open Status Change Dialog
  const handleOpenStatusChangeDialog = () => {
    setOpenStatusChangeDialog(true);
  };

  // Function to close all Dialogs
  const handleCloseDialogs = () => {
    setOpenConfirmationDialog(false);
    setOpenStatusChangeDialog(false);
  };

  const handleMentorSwitchChange = async () => {
    if (user.role.id === 2) {
      const newUserData: UserFormAdminDTO = {
        ...user,
        role: {
          id: 3,
          roleName: "mentor",
        },
      };

      try {
        const fetchData = async (url: string, userData: UserFormAdminDTO) => {
          return await sendRequest<RequestUserUpdateFormAdmin>({
            url: url,
            method: "POST",
            body: userData,
          });
        };
        const response = await fetchData(
          `${GLOBAL_URL}/api/admin/update-user`,
          newUserData
        );
        const dataupdate = response.model;
        console.log("data update", response.model);
        if (response.statusCode == 200) {
          handlepropdata(response.model);
        }
      } catch (error) {
        console.error("Error sending API request:", error);
      }
    } else if (user.role.id === 3) {
      const newUserData: UserFormAdminDTO = {
        ...user,
        role: {
          id: 2,
          roleName: "user",
        },
      };
      setUser(newUserData);
      console.log("mentor ne", newUserData);

      try {
        const fetchData = async (url: string, userData: UserFormAdminDTO) => {
          return await sendRequest<RequestUserUpdateFormAdmin>({
            url: url,
            method: "POST",
            body: userData,
          });
        };
        const response = await fetchData(
          `${GLOBAL_URL}/api/admin/update-user`,
          newUserData
        );
        if (response.statusCode == 200) {
          handlepropdata(response.model);
        }
      } catch (error) {
        console.error("Error sending API request:", error);
      }
    }
    handleCloseDialogs();
  };

  const handleLockSwitchChange = async () => {
    // Logic khi switch "Account is Locked" thay đổi
    if (user.accountNonLocked == true) {
      const newUserData: UserFormAdminDTO = {
        ...user, // Giữ nguyên các giá trị từ user ban đầu
        accountNonLocked: false,
      };
      setUser(newUserData);
      try {
        const fetchData = async (url: string, userData: UserFormAdminDTO) => {
          return await sendRequest<RequestUserUpdateFormAdmin>({
            url: url,
            method: "POST",
            body: userData,
          });
        };
        const response = await fetchData(
          `${GLOBAL_URL}/api/admin/update-user`,
          newUserData
        );
        if (response.statusCode == 200) {
          handlepropdata(response.model);
        }
      } catch (error) {
        console.error("Error sending API request:", error);
      }
    } else {
      const newUserData: UserFormAdminDTO = {
        ...user, // Giữ nguyên các giá trị từ user ban đầu
        accountNonLocked: true,
      };
      setUser(newUserData);
      try {
        const fetchData = async (url: string, userData: UserFormAdminDTO) => {
          return await sendRequest<RequestUserUpdateFormAdmin>({
            url: url,
            method: "POST",
            body: userData,
          });
        };
        const response = await fetchData(
          `${GLOBAL_URL}/api/admin/update-user`,
          newUserData
        );
        if (response.statusCode == 200) {
          handlepropdata(response.model);
        }
      } catch (error) {
        console.error("Error sending API request:", error);
      }
    }
    handleCloseDialogs();
  };

  return (
    <Card className={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover bg-[url('/img/profile/banner.png')]">
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img
            className="h-full w-full rounded-full"
            src={user.userPictureAvatar ? user.userPictureAvatar : "/OIP.jpg"}
            alt=""
          />
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {user.fullname}
        </h4>
        <p className="text-base font-normal text-gray-600">{user.email}</p>
      </div>

      {/* Post followers */}
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
          <p className="text-sm font-normal text-gray-600">Posts</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {user.totalPost}
          </p>
          <p className="text-sm font-normal text-gray-600">Friend</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {user.totalReport}
          </p>
          <p className="text-sm font-normal text-gray-600">Report</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Switch
          id="switch2"
          checked={user.role.id === 3}
          onChange={handleOpenConfirmationDialog}
        />
        <label
          htmlFor="switch2"
          className="text-base font-medium text-navy-700 dark:text-white cursor-pointer"
        >
          Account is Mentor
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Switch
          id="switch2"
          checked={!user.accountNonLocked}
          onChange={handleOpenStatusChangeDialog}
        />
        <label
          htmlFor="switch2"
          className="text-base font-medium text-navy-700 dark:text-white cursor-pointer"
        >
          Account is Locked
        </label>
      </div>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseDialogs}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc là muốn thay đổi vai trò của account này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Hủy bỏ</Button>
          <Button onClick={handleMentorSwitchChange} autoFocus>
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog
        open={openStatusChangeDialog}
        onClose={handleCloseDialogs}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc là muốn thay đổi trạng thái của account này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Hủy bỏ</Button>
          <Button onClick={handleLockSwitchChange} autoFocus>
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Banner;
