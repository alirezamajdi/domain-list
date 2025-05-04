import { Input, Select, Space } from "antd";
import {
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";

interface DomainControlsProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  sortOrder: "asc" | "desc" | null;
  onSortChange: (value: "asc" | "desc" | null) => void;
}

const DomainControls = ({
  searchText,
  onSearchChange,
  sortOrder,
  onSortChange,
}: DomainControlsProps) => {
  return (
    <Space size={30}>
      <Select
        placeholder="Sort by date"
        style={{ width: 200, height: 47 }}
        size="large"
        value={sortOrder}
        onChange={onSortChange}
        allowClear
        className="!w-[300px] !rounded-[4px] [&_.ant-select-selector]:!rounded-[4px] [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:hover:border-blue-500 [&_.ant-select-selector]:focus-within:border-blue-500 [&_.ant-select-selector]:focus-within:shadow-none"
      >
        <Select.Option value="asc">
          <Space>
            <SortAscendingOutlined />
            Order by Ascending
          </Space>
        </Select.Option>
        <Select.Option value="desc">
          <Space>
            <SortDescendingOutlined />
            Order by Descending
          </Space>
        </Select.Option>
      </Select>
      <Input
        placeholder="Search domains"
        allowClear
        prefix={<SearchOutlined className="text-gray-400" />}
        size="large"
        className="rounded-[4px] h-[47px] w-[300px] border-gray-200 hover:border-blue-500 focus-within:border-blue-500 focus-within:shadow-none"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Space>
  );
};

export default DomainControls;
