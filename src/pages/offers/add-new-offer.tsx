/* eslint-disable @next/next/no-img-element */

import { generatorRandomText } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, FormProps, Input, Upload } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

interface FieldType {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    percent: string;
    code: string;
    fileList?: [];
}
const AddNewOffer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleAddNewOffer: FormProps<FieldType>["onFinish"] = (values) => {
        console.log("Success", values);
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div className="col-md-8 offset-md-2">
            <Card>
                <Form
                    disabled={isLoading}
                    layout="vertical"
                    name="offer"
                    initialValues={{
                        description: "",
                        fileList: [],
                        code: generatorRandomText(),
                    }}
                    onFinish={handleAddNewOffer}
                >
                    <Form.Item<FieldType>
                        label="Title"
                        name={"title"}
                        rules={[
                            {
                                required: true,
                                message: "Please input the title offer",
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Description"
                        name={"description"}
                    >
                        <Input.TextArea rows={2} allowClear />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Start date"
                        name={"startDate"}
                        initialValue={dayjs(new Date())}
                        rules={[
                            {
                                required: true,
                                message: "Please select the start date",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{
                                width: "100%",
                            }}
                            format={"DD/MM/YYYY"}
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="End date"
                        name={"endDate"}
                        rules={[
                            {
                                required: true,
                                message: "Please select the end date",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{
                                width: "100%",
                            }}
                            format={"DD/MM/YYYY"}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Percent"
                        name={"percent"}
                        rules={[
                            {
                                required: true,
                                message: "Please input percent",
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Code"
                        name={"code"}
                        rules={[
                            {
                                required: true,
                                message: "Please input code",
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Upload"
                        name={"fileList"}
                        valuePropName={"fileList"}
                        getValueFromEvent={normFile}
                    >
                        <Upload listType="picture-card">
                            <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <div className="text-right">
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddNewOffer;
