import {
    AvatarComponent,
    CategoryComponent,
    HeadComponent,
} from "@/components";
import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { File, Product } from "@/models";
import { HandleFile } from "@/utils";
import { Button, Modal, Space, Table, Tag, Tooltip } from "antd";
import { ColumnProps } from "antd/es/table";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";

const { confirm } = Modal;
const Products = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        onSnapshot(collection(fs, collectionNames.products), (snap) => {
            if (snap.empty) {
                console.log("Products not found");
                setProducts([]);
            } else {
                const tempProducts: Product[] = [];
                snap.forEach((item: any) => {
                    tempProducts.push({
                        id: item.id,
                        ...item.data(),
                    });
                });
                setProducts(tempProducts);
            }
        });
    }, []);
    const handleDeleteProduct = async (item: Product) => {
        if (item.files && item.files.length > 0) {
            item.files.forEach(
                async (file: File) =>
                    await HandleFile.removeFile(
                        collectionNames.products,
                        item.id,
                        file
                    )
            );
        } else {
            await deleteDoc(doc(fs, `${collectionNames.products}/${item.id}`));
        }
    };
    const columns: ColumnProps<Product>[] = [
        {
            key: "TITLE",
            dataIndex: "title",
            title: "Title",
        },
        {
            key: "DESCRIPTION",
            dataIndex: "description",
            title: "Description",
        },
        {
            key: "TYPE",
            dataIndex: "type",
            title: "Type",
        },
        {
            key: "CATEGORIES",
            title: "Categories",
            dataIndex: "categories",
            render: (ids: string[]) => {
                if (ids && ids.length > 0) {
                    return (
                        <Space>
                            {ids.map((id) => (
                                <Tag key={id}>
                                    <CategoryComponent id={id} />
                                </Tag>
                            ))}
                        </Space>
                    );
                }
                return null;
            },
        },
        {
            key: "PRICE",
            dataIndex: "price",
            title: "Price",
        },
        {
            key: "IMAGE",
            dataIndex: "",
            title: "Image",
            render: (item: Product) => {
                if (item.files) {
                    return <AvatarComponent imageUrl={item.files[0].url} />;
                }
                return null;
            },
        },
        {
            key: "ACTION",
            title: "Action",
            align: "right",
            dataIndex: "",
            render: (item: Product) => {
                return (
                    <Space>
                        <Tooltip title="Edit product">
                            <Button
                                type="text"
                                icon={<FaEdit color="#676767" size={20} />}
                                onClick={() =>
                                    router.push(
                                        `/products/add-new-product?id=${item.id}`
                                    )
                                }
                            />
                        </Tooltip>
                        <Tooltip title="Add sub product">
                            <Button
                                type="text"
                                icon={<FcAddImage size={22} />}
                                onClick={() =>
                                    router.push(
                                        `/products/add-sub-product?id=${item.id}`
                                    )
                                }
                            />
                        </Tooltip>
                        <Tooltip title="Add sub product">
                            <Button
                                type="text"
                                danger
                                icon={<BiTrash size={20} />}
                                onClick={() =>
                                    confirm({
                                        title: "Confirm",
                                        content: "Delete product?",
                                        onOk: () => handleDeleteProduct(item),
                                    })
                                }
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];
    return (
        <div>
            <HeadComponent
                title="Products"
                pageTitle="Products"
                extra={
                    <Button
                        type="primary"
                        onClick={() => router.push("/products/add-new-product")}
                    >
                        Add new
                    </Button>
                }
            />
            <Table dataSource={products} columns={columns} />
        </div>
    );
};

export default Products;
