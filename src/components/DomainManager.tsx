import { useState } from "react";
import {
  useGetDomainsQuery,
  useCreateDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
  useUpdateDomainStatusMutation,
  useToggleDomainActiveMutation,
} from "../store/api/domainApiSlice";
import { Domain, DomainStatus } from "../types/domain";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const DomainManager = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  // RTK Query hooks
  const { data: domains = [], isLoading } = useGetDomainsQuery({});
  const [createDomain] = useCreateDomainMutation();
  const [updateDomain] = useUpdateDomainMutation();
  const [deleteDomain] = useDeleteDomainMutation();
  const [updateDomainStatus] = useUpdateDomainStatusMutation();
  const [toggleDomainActive] = useToggleDomainActiveMutation();

  const handleCreate = async (
    values: Omit<Domain, "id" | "createdDate" | "updatedDate">
  ) => {
    try {
      await createDomain(values).unwrap();
      message.success("Domain created successfully");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create domain");
    }
  };

  const handleUpdate = async (values: Partial<Domain>) => {
    if (!editingDomain) return;
    try {
      await updateDomain({ id: editingDomain.id, ...values }).unwrap();
      message.success("Domain updated successfully");
      setIsModalVisible(false);
      setEditingDomain(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update domain");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDomain(id).unwrap();
      message.success("Domain deleted successfully");
    } catch (error) {
      message.error("Failed to delete domain");
    }
  };

  const handleStatusChange = async (id: string, status: DomainStatus) => {
    try {
      await updateDomainStatus({ id, status }).unwrap();
      message.success("Domain status updated successfully");
    } catch (error) {
      message.error("Failed to update domain status");
    }
  };

  const handleActiveToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleDomainActive({ id, isActive: !isActive }).unwrap();
      message.success(
        `Domain ${isActive ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      message.error("Failed to toggle domain status");
    }
  };

  const columns = [
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: DomainStatus, record: Domain) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="verified">Verified</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Domain) => (
        <Button
          type="text"
          icon={isActive ? <CheckOutlined /> : <CloseOutlined />}
          onClick={() => handleActiveToggle(record.id, isActive)}
        />
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: number) => new Date(date * 1000).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Domain) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDomain(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Domain Management</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingDomain(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Domain
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={domains}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title={editingDomain ? "Edit Domain" : "Add Domain"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingDomain(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingDomain ? handleUpdate : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="domain"
            label="Domain"
            rules={[{ required: true, message: "Please input domain!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="verified">Verified</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDomain ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DomainManager;
