import { Table, Dropdown, Button } from "antd";
import { Domain, DomainStatus } from "../types/domain";
import { InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

interface DomainTableProps {
  domains: Domain[];
  isLoading: boolean;
  onViewDetails: (record: Domain) => void;
  onEditClick: (record: Domain) => void;
  onDeleteDomain: (id: string) => void;
}

const DomainTable = ({
  domains,
  isLoading,
  onViewDetails,
  onEditClick,
  onDeleteDomain,
}: DomainTableProps) => {
  const columns = [
    {
      title: "Domain URL",
      dataIndex: "domain",
      key: "domain",
      render: (domain: string, record: Domain) => (
        <div className="flex items-center gap-2">
          {record.isActive && record.status === "verified" ? (
            <div className="w-3 h-3 rounded-full bg-green-500" />
          ) : (
            <InfoCircleOutlined className="text-red-500" />
          )}
          <a
            href={domain}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
          >
            {domain}
            <LiaExternalLinkAltSolid className="text-gray-500 text-lg" />
          </a>
        </div>
      ),
    },
    {
      title: "Verification Status",
      dataIndex: "status",
      key: "status",
      render: (status: DomainStatus) => {
        const statusConfig = {
          verified: { text: "Verified", color: "text-green-600" },
          pending: { text: "Pending", color: "text-yellow-600" },
          rejected: { text: "Not Verified", color: "text-red-600" },
        };
        const config = statusConfig[status] || {
          text: status,
          color: "text-gray-600",
        };
        return <span className={config.color}>{config.text}</span>;
      },
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <span className={isActive ? "text-green-600" : "text-red-600"}>
          {isActive ? "Active" : "Not Active"}
        </span>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: number) => new Date(date * 1000).toLocaleDateString(),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
      render: (date: number | undefined) =>
        date ? new Date(date * 1000).toLocaleDateString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Domain) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                onClick: () => onViewDetails(record),
              },
              {
                key: "edit",
                label: "Edit",
                onClick: () => onEditClick(record),
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => onDeleteDomain(record.id),
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
          overlayStyle={{ width: 160 }}
        >
          <Button
            type="text"
            icon={<MoreOutlined style={{ fontSize: "20px" }} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={domains}
      loading={isLoading}
      rowKey="id"
      className="[&_.ant-table-row:hover]:shadow-none [&_.ant-table]:hover:shadow-none"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} domains`,
        total: domains.length,
      }}
    />
  );
};

export default DomainTable;
