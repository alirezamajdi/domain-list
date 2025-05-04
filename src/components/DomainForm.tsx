import { Form, Input, Select, Checkbox } from "antd";
import { Domain } from "../types/domain";

interface DomainFormProps {
  form: any;
  isEditMode: boolean;
  onFinish: (values: Partial<Domain>) => void;
  isSubmitting: boolean;
}

const DomainForm = ({
  form,
  onFinish,
}: DomainFormProps) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="domain"
        label="Domain URL"
        rules={[
          { required: true, message: "Please input domain URL!" },
          { type: "url", message: "Please enter a valid URL!" },
        ]}
      >
        <Input placeholder="Ex: https://www.bridged.media" style={{ height: "46px" }} />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select status!" }]}
      >
        <Select placeholder="Select status" style={{ height: "46px" }}>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="verified">Verified</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="isActive" valuePropName="checked">
        <Checkbox style={{ fontSize: "16px" }}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

export default DomainForm;
