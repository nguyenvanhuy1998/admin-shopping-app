/* eslint-disable jsx-a11y/alt-text */
import { HeadComponent, ImagePicker } from "@/components";
import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { Button, Card, Form, Image, Input, Select } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";

interface CategorySelect {
    label: string;
    value: string;
}
export interface FormDataProduct {
    title: string;
    type: string;
    categories: string[];
    description?: string;
    price: string;
    files?: FileList;
}
const AddNewProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<CategorySelect[]>([]);
    const [files, setFiles] = useState<FileList>();

    const [form] = Form.useForm<FormDataProduct>();
    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        onSnapshot(collection(fs, collectionNames.categories), (snap) => {
            if (snap.empty) {
                console.log("Categories not found");
            } else {
                const newCategories: CategorySelect[] = [];
                snap.forEach((item: any) => {
                    newCategories.push({
                        value: item.id,
                        label: item.data().title,
                    });
                });
                setCategories(newCategories);
            }
        });
    };
    const handleAddNewProduct = (values: FormDataProduct) => {};

    return (
        <div>
            <HeadComponent
                title="Add new product"
                pageTitle="Add new product"
                extra={
                    <Button
                        type="primary"
                        icon={<BiAddToQueue size={22} />}
                        onClick={() => {}}
                    >
                        Add new category
                    </Button>
                }
            />
            <div className="col-md-8">
                <Card title="Form add new product">
                    <Form
                        disabled={isLoading}
                        size="large"
                        form={form}
                        layout="vertical"
                        onFinish={handleAddNewProduct}
                    >
                        <Form.Item
                            name={"title"}
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a title",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter title"
                                maxLength={150}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item
                            name={"type"}
                            label="Type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a type",
                                },
                            ]}
                        >
                            <Input placeholder="Enter type" allowClear />
                        </Form.Item>
                        <Form.Item
                            name={"categories"}
                            label="Categories"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select category"
                                mode="multiple"
                                options={categories}
                            />
                        </Form.Item>
                        <Form.Item name={"description"} label="Description">
                            <Input.TextArea
                                rows={3}
                                placeholder="Enter description"
                            />
                        </Form.Item>
                        <Form.Item
                            name={"price"}
                            label="Price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a price",
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Enter price" />
                        </Form.Item>

                        <ImagePicker
                            files={files}
                            loading={isLoading}
                            onSelected={(values) =>
                                setFiles(values.target.files as FileList)
                            }
                        />
                        <div className="mt-3 text-right">
                            <Button
                                loading={isLoading}
                                onClick={() => form.submit()}
                                type="primary"
                            >
                                Publish
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default AddNewProduct;
