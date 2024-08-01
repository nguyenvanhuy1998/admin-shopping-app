import { generatorRandomText } from "@/utils/generatorRandomText";
import { Button, Card, Form, Input } from "antd";
import React, { useEffect } from "react";

const AddNewOffer = () => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            code: generatorRandomText(),
        });
    }, [form]);
    const addNewOffer = (values: any) => {
        console.log({ values });
    };
    return (
        <div>
            <Card className="col-md-8 offset-md-2">
                <Form layout="vertical" form={form} onFinish={addNewOffer}>
                    <Form.Item
                        name={"title"}
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: "Please enter title offer",
                            },
                        ]}
                    >
                        <Input placeholder="Enter title" allowClear />
                    </Form.Item>
                    <Form.Item name={"description"} label="Description">
                        <Input.TextArea
                            rows={2}
                            placeholder="Enter description"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name={"code"} label="Code">
                        <Input disabled readOnly placeholder="Code" />
                    </Form.Item>
                </Form>
                <div className="text-right">
                    <Button type="primary" onClick={() => form.submit()}>
                        Publish
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AddNewOffer;
