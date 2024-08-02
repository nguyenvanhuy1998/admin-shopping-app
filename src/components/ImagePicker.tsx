/* eslint-disable @next/next/no-img-element */
import { Button } from "antd";
import React, { ChangeEvent, useRef } from "react";
import { BiUpload } from "react-icons/bi";
interface Props {
    files?: FileList;
    onSelected: (files: ChangeEvent<HTMLInputElement>) => void;
    multiple?: boolean;
    accept?: string;
    loading?: boolean;
}
const ImagePicker = ({
    onSelected,
    multiple,
    accept,
    loading,
    files,
}: Props) => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
        <>
            {files && files.length > 0 && (
                <div className="row">
                    {Array.from(files).map((file, index) => (
                        <div key={index} className="col-6">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                style={{ width: "100%" }}
                            />
                        </div>
                    ))}
                </div>
            )}
            <Button
                loading={loading}
                className="mt-2"
                onClick={() => {
                    if (fileRef.current) {
                        fileRef.current.click();
                    }
                }}
                icon={<BiUpload size={18} />}
            >
                Upload
            </Button>
            <div className="d-none">
                <input
                    onChange={onSelected}
                    ref={fileRef}
                    type="file"
                    multiple={multiple}
                    accept={accept ?? "image/*"}
                    name=""
                    id=""
                />
            </div>
        </>
    );
};

export default ImagePicker;
