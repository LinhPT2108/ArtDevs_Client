"use client";
import Card from "@/components/admin/card";
import CardMenu from "@/components/admin/card/CardMenu";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import { Snackbar } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import {
  BsCloudCheck,
  BsExclamationOctagonFill,
  BsFillChatSquareTextFill,
} from "react-icons/bs";
interface Props {
  // Định nghĩa prop onClick
  data: HashtagInfor | null;

  getDataNew: (newData: HashtagInfor) => void;
}
const HashtagDetail = ({ data, getDataNew }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [messageReponseApi, setMessageReponseApi] = useState(String);
  const [openSnackbar, setopenSnackbar] = useState(false);

  useEffect(() => {
    // Cập nhật giá trị mô phỏng cho editedDescription khi data thay đổi
    setEditedDescription(data?.description || "");
  }, [data]);
  const handleEdit = () => {
    // Xử lý logic khi nhấn nút sửa
    setIsEditing(true);
  };

  const handleOpenSnackbar = () => {
    setopenSnackbar(true);
  };
  const handleCloseSnackbar = () => setopenSnackbar(false);
  console.log("data nè", data);
  const handleSave = async () => {
    try {
      const updatedData = {
        ...data,
        description: editedDescription,
      };

      // Gọi API để chỉnh sửa dữ liệu với giá trị mới từ updatedData
      const fetchData = await sendRequest<ReponseHashtagFormAdmin>({
        url: `${GLOBAL_URL}/api/admin/update-detailhashtag`,
        method: "POST",
        body: updatedData,
      });

      setMessageReponseApi(fetchData.message);
      handleOpenSnackbar();

      if (fetchData.statusCode === 200) {
        getDataNew(updatedData as HashtagInfor);
      }
    } catch (error) {
      console.error("Error editing:", error);
    } finally {
      // Sau khi xử lý API, đặt trạng thái isEditing về false
      setIsEditing(false);
    }
  };

  return (
    <Card className={"w-full h-full p-4"}>
      {/* Your storage */}

      <div className="mb-auto flex flex-col items-center justify-center">
        <p className="px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8">
          Chi Tiết HashTag : {data?.hashtagText}
        </p>
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="mb-px mt-3 text-2xl font-bold text-navy-700 dark:text-white resize-none"
            rows={8} // Số hàng của textarea
            cols={50} // Số kí tự trên mỗi hàng của textarea
          />
        ) : (
          <h4 className="mb-px mt-3 text-2xl font-bold text-navy-700 dark:text-white">
            {data?.description || "No description available"}
          </h4>
        )}

        {/* Thêm nút sửa */}
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
          >
            Edit
          </button>
        )}
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={messageReponseApi}
      />
    </Card>
  );
};

export default HashtagDetail;
