import { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Drawer,
  Form,
  message,
  Spin,
  Modal,
  Descriptions,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useGetDomainsQuery,
  useCreateDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
  useGetDomainByIdQuery,
} from "../store/api/domainApiSlice";
import { Domain, DomainStatus } from "../types/domain";
import { toast } from "react-toastify";
import DomainTable from "../components/DomainTable";
import DomainControls from "../components/DomainControls";
import DomainForm from "../components/DomainForm";
const { Title } = Typography;


const HomePage = () => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const { data: domains = [], isLoading } = useGetDomainsQuery({});
  const [createDomain] = useCreateDomainMutation();
  const [updateDomain] = useUpdateDomainMutation();
  const [deleteDomain] = useDeleteDomainMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const { data: domainDetailsData, isLoading: isLoadingDetails } =
    useGetDomainByIdQuery(selectedDomainId || "", {
      skip: !selectedDomainId,
    });

  const filteredDomains = domains.filter((domain) => {
    const domainName = domain?.domain;
    if (!domainName || typeof domainName !== "string") return false;
    return domainName.toLowerCase().includes(searchText.toLowerCase());
  });

  const sortedAndFilteredDomains = [...filteredDomains].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc"
      ? a.createdDate - b.createdDate
      : b.createdDate - a.createdDate;
  });

  const getStatusColor = (status: DomainStatus) => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleAddDomain = async (
    values: Omit<Domain, "id" | "createdDate" | "updatedDate">
  ) => {
    setIsSubmitting(true);
    try {
      const newDomain = {
        ...values,
        createdDate: Math.floor(Date.now() / 1000),
      };
      await createDomain(newDomain).unwrap();
      toast.success(`Domain added successfully`);
      setIsDrawerVisible(false);
      form.resetFields();
    } catch (error) {
      message.error({
        content: "Failed to add domain",
        duration: 2,
        className: "custom-toast",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDomain = async (values: Partial<Domain>) => {
    if (!editingDomain) return;
    setIsSubmitting(true);
    try {
      await updateDomain({
        id: editingDomain.id,
        ...values,
        updatedDate: Math.floor(Date.now() / 1000),
      }).unwrap();
      toast.success(`Domain updated successfully`);
      setIsDrawerVisible(false);
      form.resetFields();
      setEditingDomain(null);
      setIsEditMode(false);
    } catch (error) {
      toast.error(`Failed to update domain`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (values: Partial<Domain>) => {
    if (isEditMode) {
      handleEditDomain(values);
    } else {
      handleAddDomain(
        values as Omit<Domain, "id" | "createdDate" | "updatedDate">
      );
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await deleteDomain(id).unwrap();
      toast.success(`Domain deleted successfully`);
    } catch (error) {
      toast.error(`Failed to deleted domain`);
    } 
  };

  const handleEditClick = (record: Domain) => {
    setEditingDomain(record);
    setIsEditMode(true);
    setIsDrawerVisible(true);
    form.setFieldsValue({
      domain: record.domain,
      status: record.status,
      isActive: record.isActive,
    });
  };

  const handleViewDetails = (record: Domain) => {
    setSelectedDomainId(record.id);
  };

  const handleCloseDetails = () => {
    setSelectedDomainId(null);
  };

  return (
    <div className="py-6 px-4">
      <Title level={2}>Domains</Title>
      <div className="flex justify-between items-center mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined className="fill-white" />}
          className="h-[47px] px-7 rounded-[4px]"
          onClick={() => {
            setIsEditMode(false);
            setEditingDomain(null);
            setIsDrawerVisible(true);
            form.resetFields();
          }}
        >
          Add Domain
        </Button>
        <DomainControls
          searchText={searchText}
          onSearchChange={setSearchText}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </div>
      <Card className="border border-gray-200 shadow-none">
        <DomainTable
          domains={sortedAndFilteredDomains}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onEditClick={handleEditClick}
          onDeleteDomain={handleDeleteDomain}
        />
      </Card>
      <Modal
        title="Domain Details"
        open={!!selectedDomainId}
        onCancel={handleCloseDetails}
        footer={null}
        width={600}
      >
        {isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spin size="large" />
            <Typography.Text className="mt-4">
              Loading domain details...
            </Typography.Text>
          </div>
        ) : domainDetailsData ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Domain URL">
              <a
                href={domainDetailsData.domain}
                target="_blank"
                rel="noopener noreferrer"
              >
                {domainDetailsData.domain}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(domainDetailsData.status)}>
                {domainDetailsData.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Active">
              {domainDetailsData.isActive ? (
                <CheckOutlined style={{ color: "#52c41a" }} />
              ) : (
                <CloseOutlined style={{ color: "#ff4d4f" }} />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created Date">
              {new Date(domainDetailsData.createdDate * 1000).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated Date">
              {domainDetailsData.updatedDate
                ? new Date(
                    domainDetailsData.updatedDate * 1000
                  ).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
      <Drawer
        title={isEditMode ? "Edit Domain" : "Add New Domain"}
        placement="right"
        width={500}
        onClose={() => {
          setIsDrawerVisible(false);
          form.resetFields();
          setEditingDomain(null);
          setIsEditMode(false);
        }}
        open={isDrawerVisible}
        footer={
          <div className="flex justify-end space-x-5 pb-4 px-2">
            <Button
              onClick={() => {
                setIsDrawerVisible(false);
                form.resetFields();
                setEditingDomain(null);
                setIsEditMode(false);
              }}
              disabled={isSubmitting}
              className="h-[47px] min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isSubmitting}
              className="h-[47px] min-w-[80px]"
            >
              {isEditMode ? "Update" : "Add"}
            </Button>
          </div>
        }
        footerStyle={{ border: "none" }}
      >
        <DomainForm
          form={form}
          isEditMode={isEditMode}
          onFinish={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </Drawer>
    </div>
  );
};

export default HomePage;
