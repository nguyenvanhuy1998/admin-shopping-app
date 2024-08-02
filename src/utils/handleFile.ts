import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { replaceName } from "./replaceName";
import { handleResize } from "./resizeImage";
import { fs, storage } from "@/firebase/firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

interface FileHandle {
    files: FileList;
    id: string;
    collectionName: string;
}
export class HandleFile {
    static handleFiles = ({ files, id, collectionName }: FileHandle) => {
        const newFiles: File[] = [];
        for (const i in files) {
            if (Object.prototype.hasOwnProperty.call(files, i)) {
                const element = files[i];
                if (element.size && element.size > 0) {
                    newFiles.push(element);
                }
            }
        }
        newFiles.forEach(async (file) => {
            const newFile = await handleResize(file);
            this.uploadToStore({
                file: newFile,
                id,
                collectionName,
            });
        });
    };
    static uploadToStore = async ({
        file,
        id,
        collectionName,
    }: {
        file: File;
        id: string;
        collectionName: string;
    }) => {
        const fileName = replaceName(file.name);
        const path = `/images/${fileName}`;
        const storageRef = ref(storage, path);

        //  Upload file to STORAGE
        const res = await uploadBytes(storageRef, file);
        if (res) {
            if (res.metadata.size === file.size) {
                // get url from storage
                const url = await getDownloadURL(storageRef);
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
            });
        } catch (error) {
            console.log("Save URL to firestore database error", error);
        }
    };
}
