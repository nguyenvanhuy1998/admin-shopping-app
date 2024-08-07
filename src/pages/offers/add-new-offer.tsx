/* eslint-disable @next/next/no-img-element */
import { ImagePicker } from "@/components";
import { collectionNames } from "@/constants/collectionNames";
import { fs } from "@/firebase/firebaseConfig";
import { generatorRandomText } from "@/utils/generatorRandomText";
import { HandleFile } from "@/utils/handleFile";
import { Button, Card, DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";

interface FormData {
    title: string;
    startAt: string | number;
    description?: string;
    endAt: string | number;
    percent: string;
    code: string;
}
const AddNewOffer = () => {
    const [files, setFiles] = useState<FileList>();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm<FormData>();
    useEffect(() => {
        form.setFieldsValue({
            code: generatorRandomText(),
        });
    }, [form]);
    const addNewOffer = async (values: FormData) => {
        const newData: FormData = {
            ...values,
            description: values.description ?? "",
            startAt: dayjs(values.startAt).valueOf(),
            endAt: dayjs(values.endAt).valueOf(),
        };
        setIsLoading(true);
        try {
            const snap = await addDoc(
                collection(fs, collectionNames.offers),
                newData
            );
            if (files) {
                HandleFile.handleFiles({
                    files,
                    id: snap.id,
                    collectionName: collectionNames.offers,
                });
            }
            form.resetFields();
            window.history.back();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("error add new offer", error);
        }
    };
    const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        if (files) {
            setFiles(files);
        }
    };
    return (
        <div>
            <Card className="col-md-8 offset-md-2">
                <Form
                    disabled={isLoading}
                    layout="vertical"
                    form={form}
                    onFinish={addNewOffer}
                >
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
                    <div className="row">
                        <div className="col">
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select start at",
                                    },
                                ]}
                                name={"startAt"}
                                initialValue={dayjs(new Date())}
                                label="Start at"
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>
                        </div>
                        <div className="col">
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select end at",
                                    },
                                ]}
                                name={"endAt"}
                                label="End at"
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Please enter percent",
                            },
                        ]}
                        name={"percent"}
                        label="Percent"
                    >
                        <Input type="number" placeholder="percent" allowClear />
                    </Form.Item>
                    <Form.Item name={"code"} label="Code">
                        <Input disabled readOnly placeholder="Code" />
                    </Form.Item>
                </Form>

                <ImagePicker
                    files={files}
                    loading={isLoading}
                    onSelected={handleSelectedFile}
                />
                <div className="text-right">
                    <Button
                        loading={isLoading}
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        Publish
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AddNewOffer;
