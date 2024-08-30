import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { File } from "@/models";
import { Avatar } from "antd";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {
    fileId: string;
};

const AvatarComponent = ({ fileId }: Props) => {
    const [file, setFile] = useState<File>();

    useEffect(() => {
        const getFilesFromFireStore = async () => {
            try {
                const snap = await getDoc(
                    doc(fs, `${collectionNames.files}/${fileId}`)
                );
                const cloneFile: any = {
                    id: snap.id,
                    ...snap.data(),
                };
                if (snap.exists()) {
                    setFile(cloneFile);
                } else {
                    console.log("file not found");
                }
            } catch (error) {
                console.log(error);
            }
        };
        getFilesFromFireStore();
    }, [fileId]);

    return file ? <Avatar src={file.url} /> : <></>;
};
export default AvatarComponent;
