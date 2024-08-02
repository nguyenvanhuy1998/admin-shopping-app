/* eslint-disable @next/next/no-img-element */
import { ImagePicker } from "@/components";
import { fs } from "@/firebase/firebaseConfig";
import { generatorRandomText } from "@/utils/generatorRandomText";
import { HandleFile } from "@/utils/handleFile";
import { Button, Card, Form, Input } from "antd";
import { addDoc, collection } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";

const AddNewOffer = () => {
    const [files, setFiles] = useState<any>("");
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            code: generatorRandomText(),
        });
    }, [form]);
    const addNewOffer = async (values: any) => {
        const data: any = {};
        for (const i in values) {
            if (Object.prototype.hasOwnProperty.call(values, i)) {
                const element = values[i];
                data[i] = element ?? "";
            }
        }
        setIsLoading(true);
        try {
            const snap = await addDoc(collection(fs, "offers"), data);

            if (files) {
                HandleFile.HandleFiles(files, snap.id, "offers");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("error add new offer", error);
        }
    };
    const handleSelectedFile = (files: ChangeEvent<HTMLInputElement>) => {
        setFiles(files.target.files);
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
                    <Form.Item name={"code"} label="Code">
                        <Input disabled readOnly placeholder="Code" />
                    </Form.Item>
                </Form>
                {files.length > 0 && (
                    <div>
                        <img
                            src={URL.createObjectURL(files[0])}
                            alt=""
                            style={{
                                width: 200,
                                height: "auto",
                            }}
                        />
                    </div>
                )}
                <ImagePicker
                    multiple
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
