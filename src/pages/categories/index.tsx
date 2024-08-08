import { AvatarComponent, HeadComponent } from "@/components";
import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { AddNewCategory } from "@/modals";
import { Category } from "@/models";
import { HandleFile } from "@/utils";
import { Button, message, Modal, Space } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";

export interface FormCategoryData {
    title: string;
    files?: FileList;
}
const { confirm } = Modal;
const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [titleCategory, setTitleCategory] = useState("");
    const [files, setFiles] = useState<FileList>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        onSnapshot(collection(fs, collectionNames.categories), (snap) => {
            if (snap.empty) {
                console.log("Data not found");
                setCategories([]);
            } else {
                const items: Category[] = [];
                snap.forEach((item: any) => {
                    items.push({
                        id: item.id,
                        ...item.data(),
                    });
                });
                setCategories(items);
            }
        });
    }, []);

    const handleAddNewCategory = () => {
        if (!titleCategory) {
            message.error("Missing title category");
        } else {
            addCategoriesToFireStore();
        }
    };
    const addCategoriesToFireStore = async () => {
        setIsLoading(true);
        try {
            const snap = await addDoc(
                collection(fs, collectionNames.categories),
                {
                    title: titleCategory,
                    createdAt: Date.now(),
                    updateAt: Date.now(),
                }
            );
            if (files && files.length > 0) {
                await HandleFile.handleFiles({
                    files,
                    id: snap.id,
                    collectionName: collectionNames.categories,
                });
            }
            setIsLoading(false);
            setTitleCategory("");
            setFiles(undefined);
            setVisibleModal(false);
        } catch (error: any) {
            message.error(error.message);
            setIsLoading(false);
        }
    };
    const handleDeleteCategory = async (item: Category) => {
        if (item.files && item.files.length > 0) {
            item.files.forEach(
                async (file) =>
                    await HandleFile.removeFile(
                        collectionNames.categories,
                        item.id,
                        file
                    )
            );
        } else {
            await deleteDoc(
                doc(fs, `${collectionNames.categories}/${item.id}`)
            );
        }
    };
    const columns: ColumnProps<Category>[] = [
        {
            key: "TITLE",
            dataIndex: "title",
            title: "Title",
        },
        {
            key: "CREATED_AT",
            dataIndex: "createdAt",
            title: "Created at",
            render: (time: number) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            key: "UPDATED_AT",
            dataIndex: "updatedAt",
            title: "Updated at",
            render: (time: number) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
        },

        {
            key: "IMAGE_URL",
            dataIndex: "",
            title: "Avatar",
            render: (item: Category) => {
                if (item.files) {
                    return <AvatarComponent imageUrl={item.files[0].url} />;
                }
                return null;
            },
        },
        {
            key: "DELETE",
            dataIndex: "",
            title: "Action",
            render: (item: Category) => {
                return (
                    <Space>
                        <Button
                            type="text"
                            danger
                            icon={<BiTrash size={20} />}
                            onClick={() =>
                                confirm({
                                    title: "Confirm",
                                    content: "Delete category?",
                                    onOk: () => handleDeleteCategory(item),
                                })
                            }
                        />
                    </Space>
                );
            },
        },
    ];
    return (
        <div>
            <HeadComponent
                title="Categories"
                pageTitle="Categories"
                extra={
                    <Button
                        type="primary"
                        onClick={() => setVisibleModal(true)}
                    >
                        Add new
                    </Button>
                }
            />
            <Table dataSource={categories} columns={columns} />
            <AddNewCategory
                visible={visibleModal}
                setVisibleModal={setVisibleModal}
                titleCategory={titleCategory}
                setTitleCategory={setTitleCategory}
                files={files}
                setFiles={setFiles}
                loading={isLoading}
                onAddNewCategory={handleAddNewCategory}
            />
        </div>
    );
};

export default Categories;
