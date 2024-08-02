import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { replaceName } from "./replaceName";
import { handleResize } from "./resizeImage";
import { fs, storage } from "@/firebase/firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export class HandleFile {
    static HandleFiles = (files: any, id: string, collectionName: string) => {
        const items: any[] = [];
        for (const i in files) {
            if (Object.prototype.hasOwnProperty.call(files, i)) {
                const element = files[i];
                if (element.size && element.size > 0) {
                    items.push(element);
                }
            }
        }
        console.log({ items });

        items.forEach(async (item) => {
            const newFile = await handleResize(item);
            console.log({ newFile });
            this.UploadToStore(newFile, id, collectionName);
        });
    };
    static UploadToStore = async (
        file: any,
        id: string,
        collectionName: string
    ) => {
        const fileName = replaceName(file.name);
        const path = `/images/${fileName}`;
        const storageRef = ref(storage, path);
        console.log({ fileName, path, storageRef });

        // Upload file to fire storage
        const res = await uploadBytes(storageRef, file);
        if (res) {
            if (res.metadata.size === file.size) {
                // get url from storage
                const url = await getDownloadURL(storageRef);
                console.log({ url });
                // Save url and path to firestore database
                this.SaveURLToFireStoreDB({
                    url,
                    path,
                    id,
                    collectionName,
                });
            } else {
                return "Uploading";
            }
        } else {
            return "Error Upload";
        }
    };
    static SaveURLToFireStoreDB = async ({
        path,
        url,
        id,
        collectionName,
    }: {
        path: string;
        url: string;
        id: string;
        collectionName: string;
    }) => {
        try {
            await updateDoc(doc(fs, `${collectionName}/${id}`), {
                files: arrayUnion({
                    path,
                    url,
                }),
                imageUrl: url,
            });
        } catch (error) {
            console.log("Save URL to firestore database error", error);
        }
    };
}
