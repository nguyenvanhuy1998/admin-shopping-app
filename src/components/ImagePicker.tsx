import { Button } from "antd";
import React, { ChangeEvent, useRef } from "react";
import { BiUpload } from "react-icons/bi";
interface Props {
    onSelected: (files: ChangeEvent<HTMLInputElement>) => void;
    multiple?: boolean;
    accept?: string;
    loading?: boolean;
}
const ImagePicker = ({ onSelected, multiple, accept, loading }: Props) => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
        <>
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
