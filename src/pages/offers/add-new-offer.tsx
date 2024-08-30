/* eslint-disable @next/next/no-img-element */

import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { generatorRandomText, HandleFile } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, Upload } from "antd";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import { omit } from "lodash";
import { useState } from "react";

interface FormData {
    code: string;
    title: string;
    startDate: number;
    endDate: number;
    files?: any;
    percent: string;
    updatedAt: number;
    createdAt: number;
    description?: string;
}
const AddNewOffer = () => {
    const [form] = Form.useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const handleAddNewOffer = (values: FormData) => {
        const formatData: FormData = {
            ...values,
            description: values.description ?? "",
            startDate: dayjs(values.startDate).valueOf(),
            endDate: dayjs(values.endDate).valueOf(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            files: values.files ?? "",
        };
        onAddNewOfferToFirebase(formatData);
    };
    const onAddNewOfferToFirebase = async (data: FormData) => {
        setIsLoading(true);
        try {
            const snap = await addDoc(
                collection(fs, collectionNames.offers),
                omit(data, "files")
            );
            handleFilesToFirebase(data.files, snap.id);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    const handleFilesToFirebase = (files: any, id: string) => {
        if (files) {
            HandleFile.handleFiles({
                files,
                id,
                collectionName: collectionNames.offers,
            });
        }
        form.resetFields();
        window.history.back();
        setIsLoading(false);
    };

    return (
        <div className="col-md-8 offset-md-2">
            <Card>
                <Form
                    disabled={isLoading}
                    layout="vertical"
                    form={form}
                    initialValues={{
                        code: generatorRandomText(),
                    }}
                    onFinish={handleAddNewOffer}
                >
                    <Form.Item
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
                    <Form.Item label="Description" name={"description"}>
                        <Input.TextArea rows={2} allowClear />
                    </Form.Item>

                    <Form.Item
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

                    <Form.Item
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
                    <Form.Item
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
                    <Form.Item
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

                    <Form.Item
                        label="Upload"
                        name={"files"}
                        valuePropName={"fileList"}
                        getValueFromEvent={normFile}
                    >
                        <Upload listType="picture-card" maxCount={1}>
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
                            <Button
                                loading={isLoading}
                                type="primary"
                                htmlType="submit"
                                onClick={() => form.submit()}
                            >
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
