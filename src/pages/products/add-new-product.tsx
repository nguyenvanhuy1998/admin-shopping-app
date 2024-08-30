import { HeadComponent } from "@/components";
import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { Category } from "@/models";
import { HandleFile } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Select, Upload } from "antd";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
interface FormData {
    title: string;
    type: string;
    categories: string[];
    description?: string;
    price: string;
    files?: any;
    createdAt: number;
    updatedAt: number;
    rate: number;
}
interface SelectCategory {
    label: string;
    value: string;
}
const AddNewProduct = () => {
    const router = useRouter();
    const [form] = Form.useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [optionsCategory, setOptionsCategory] = useState<SelectCategory[]>(
        []
    );

    useEffect(() => {
        getCategoriesFromFirestore();
    }, []);
    const getCategoriesFromFirestore = () => {
        onSnapshot(collection(fs, collectionNames.categories), (snap) => {
            if (snap.empty) {
                console.log("Categories not found");
            } else {
                const options: SelectCategory[] = [];
                snap.forEach((item: any) => {
                    options.push({
                        value: item.id,
                        label: item.data().title,
                    });
                });
                setOptionsCategory(options);
            }
        });
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const handleAddNewProduct = (values: FormData) => {
        const formatData: FormData = {
            ...values,
            description: values.description ?? "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            rate: 0,
            files: values.files ?? "",
        };
        onAddNewProductToFireStore(formatData);
    };
    const onAddNewProductToFireStore = async (data: FormData) => {
        setIsLoading(true);
        try {
            const snap = await addDoc(
                collection(fs, collectionNames.products),
                omit(data, "files")
            );
            handleFilesToFirebase(data.files, snap.id);
        } catch (error: any) {
            message.error(error.message);
            setIsLoading(false);
        }
    };
    const handleFilesToFirebase = (files: any, id: string) => {
        if (files) {
            HandleFile.handleFiles({
                files,
                id,
                collectionName: collectionNames.products,
            });
        }
        setIsLoading(false);
        window.history.back();
        form.resetFields();
    };

    return (
        <div>
            <HeadComponent
                title="Add new product"
                pageTitle="Add new product"
                extra={
                    <Button
                        type="primary"
                        onClick={() =>
                            router.push("/categories/add-new-category")
                        }
                        icon={<BiAddToQueue size={22} />}
                    >
                        Add new category
                    </Button>
                }
            />
            <div className="col-md-8 offset-md-2">
                <Card>
                    <Form
                        disabled={isLoading}
                        size="large"
                        form={form}
                        layout="vertical"
                        onFinish={handleAddNewProduct}
                    >
                        <Form.Item
                            label="Title"
                            name={"title"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the title product",
                                },
                            ]}
                        >
                            <Input allowClear maxLength={150} />
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name={"type"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the type product",
                                },
                            ]}
                        >
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item
                            name={"categories"}
                            label="Categories"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select category",
                                },
                            ]}
                        >
                            <Select mode="multiple" options={optionsCategory} />
                        </Form.Item>
                        <Form.Item label="Description" name={"description"}>
                            <Input.TextArea rows={3} allowClear />
                        </Form.Item>
                        <Form.Item
                            name={"price"}
                            label="Price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input price",
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Upload"
                            name={"files"}
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
        </div>
    );
};

export default AddNewProduct;
