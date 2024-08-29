import { AvatarComponent, HeadComponent } from "@/components";
import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { Category } from "@/models";
import { HandleFile } from "@/utils";
import { Button, Modal, Space } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";

const { confirm } = Modal;
const Categories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

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

    const handleDeleteCategory = async (item: Category) => {
        if (item.files && item.files.length > 0) {
            item.files.forEach(
                async (file: any) =>
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
                        onClick={() =>
                            router.push("/categories/add-new-category")
                        }
                    >
                        Add new
                    </Button>
                }
            />
            <Table dataSource={categories} columns={columns} />
        </div>
    );
};

export default Categories;
