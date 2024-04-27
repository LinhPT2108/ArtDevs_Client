import React from "react";

interface GlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: (filterValue: string) => void;
}

export const FilterTable: React.FC<GlobalFilterProps> = ({
  globalFilter,
  setGlobalFilter,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  return (
    <div className="flex items-center my-4">
      {" "}
      {/* Sử dụng flexbox để đảm bảo label và input nằm trên cùng một hàng */}
      <label className="block text-gray-700 text-sm font-bold mr-2">
        Tìm kiếm:
      </label>{" "}
      {/* Thêm margin-right để tạo khoảng cách giữa label và input */}
      <input
        className="shadow appearance-none border rounded max-w-[150px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Nội dung..."
        value={globalFilter || ""}
        onChange={handleInputChange}
      />
    </div>
  );
};
