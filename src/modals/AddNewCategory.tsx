import { ImagePicker } from "@/components";
import { Input, Modal } from "antd";
import React from "react";

type Props = {
    visible: boolean;
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
    titleCategory: string;
    setTitleCategory: React.Dispatch<React.SetStateAction<string>>;
    files?: FileList;
    setFiles: React.Dispatch<React.SetStateAction<FileList | undefined>>;
    onAddNewCategory: () => void;
    loading?: boolean;
};

const AddNewCategory = ({
    visible,
    setVisibleModal,
    loading,
    titleCategory,
    setTitleCategory,
    files,
    setFiles,
    onAddNewCategory,
}: Props) => {
    const handleClose = () => {
        setTitleCategory("");
        setFiles(undefined);
        setVisibleModal(false);
    };
    return (
        <Modal
            open={visible}
            loading={loading}
            onOk={onAddNewCategory}
            onCancel={handleClose}
            title="Add New Category"
        >
            <div className="mb-3 mt-3">
                <Input
                    size="large"
                    placeholder="Enter category"
                    maxLength={150}
                    showCount
                    allowClear
                    value={titleCategory}
                    onChange={(value) => setTitleCategory(value.target.value)}
                />
            </div>

            <ImagePicker
                files={files}
                multiple
                loading={loading}
                onSelected={(value) => setFiles(value.target.files as FileList)}
            />
        </Modal>
    );
};

export default AddNewCategory;
