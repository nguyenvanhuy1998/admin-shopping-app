import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { File } from "@/models";
import { Avatar } from "antd";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {
    id: string;
};

const AvatarComponent = ({ id }: Props) => {
    const [file, setFile] = useState<File>();

    useEffect(() => {
        const getFileFromFireStore = async () => {
            const api = `${collectionNames.files}/${id}`;
            try {
                const snap = await getDoc(doc(fs, api));
                const tempFile: any = {
                    ...snap.data(),
                    id: snap.id,
                };
                if (snap.exists()) {
                    setFile(tempFile);
                } else {
                    console.log("File not found");
                }
            } catch (error) {
                console.log(error);
            }
        };
        getFileFromFireStore();
    }, [id]);

    return file ? <Avatar src={file.url} /> : null;
};
export default AvatarComponent;
