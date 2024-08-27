import { Button } from "antd";
import { ChangeEvent, useRef } from "react";
import { BiUpload } from "react-icons/bi";

type Props = {
    loading?: boolean;
    multiple?: boolean;
    accept?: string;
    onSelected: (files: FileList) => void;
};

const ImagePicker = ({
    loading,
    multiple,
    accept = "image/*",
    onSelected,
}: Props) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const handleUploadFile = () => {
        fileRef.current && fileRef.current.click();
    };
    const handleChangeFile = (value: ChangeEvent<HTMLInputElement>) => {
        onSelected(value.target.files as FileList);
    };
    return (
        <div>
            <Button
                loading={loading}
                className="mt-2"
                icon={<BiUpload size={18} />}
                onClick={handleUploadFile}
            >
                Upload
            </Button>
            <div className="d-none">
                <input
                    type="file"
                    ref={fileRef}
                    multiple={multiple}
                    onChange={handleChangeFile}
                    accept={accept}
                    name=""
                    id=""
                />
            </div>
        </div>
    );
};
export default ImagePicker;
