import { HeadComponent } from "@/components";
import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { AddNewCategory } from "@/modals";
import { HandleFile } from "@/utils";
import { Button, message } from "antd";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";

export interface FormCategoryData {
    title: string;
    files?: FileList;
}
const Categories = () => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [titleCategory, setTitleCategory] = useState("");
    const [files, setFiles] = useState<FileList>();
    const [isLoading, setIsLoading] = useState(false);

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
