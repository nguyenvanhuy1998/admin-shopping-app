import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { File } from "@/models";
import { HandleFile } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Upload } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { omit } from "lodash";
import React, { useState } from "react";

interface FormData {
    title: string;
    files?: any;
    createdAt: number;
    updatedAt: number;
}

const AddNewCategory = () => {
    const [form] = Form.useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddNewCategory = (values: FormData) => {
        const formatData: FormData = {
            ...values,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            files: values.files ?? "",
        };
        onAddNewCategoryToFirebase(formatData);
    };
    const onAddNewCategoryToFirebase = async (data: FormData) => {
        setIsLoading(true);
        try {
            const snap = await addDoc(
                collection(fs, collectionNames.categories),
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
                collectionName: collectionNames.categories,
            });
        }
        form.resetFields();
        window.history.back();
        setIsLoading(false);
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
                    form={form}
                    onFinish={handleAddNewCategory}
                >
                    <Form.Item
                        label="Title"
                        name={"title"}
                        rules={[
                            {
                                required: true,
                                message: "Please input the title category",
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
                        <Upload maxCount={1} listType="picture-card">
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

export default AddNewCategory;
