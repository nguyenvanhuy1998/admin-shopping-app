import { fs, storage } from "@/firebase/firebaseConfig";
import {
    arrayUnion,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { replaceName } from "./replaceName";
import { handleResize } from "./resizeImage";
import { File } from "@/models";

interface FileHandle {
    files: any;
    id: string;
    collectionName: string;
}
export class HandleFile {
    static handleFiles = async ({ files, id, collectionName }: FileHandle) => {
        files.forEach(async (file: any) => {
            const resizeFile = await handleResize(file.originFileObj);
            await this.uploadToStore({
                file: resizeFile,
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
        file: any;
        id: string;
        collectionName: string;
    }) => {
        const fileName = replaceName(file.name);
        const path = `/images/${fileName}`;
        const storageRef = ref(storage, path);

        //  Upload file to STORAGE
        const res = await uploadBytes(storageRef, file);
        console.log(res);
        if (res) {
            if (res.metadata.size === file.size) {
                // get url from storage
                const url = await getDownloadURL(storageRef);
                // Save url and path to firestore database
                await this.SaveURLToFireStoreDB({
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
                    updateAt: Date.now(),
                }),
            });
        } catch (error) {
            console.log("Save URL to firestore database error", error);
        }
    };
    static removeFile = async (
        collectionName: string,
        id: string,
        file: File
    ) => {
        try {
            const snap = await getDoc(doc(fs, `${collectionName}/${id}`));
            if (snap.exists()) {
                const existsStorage = await HandleFile.checkPathExists(
                    file.path
                );
                if (existsStorage) {
                    await deleteObject(ref(storage, `${file.path}`));
                }
                await deleteDoc(doc(fs, `${collectionName}/${id}`));
            }
        } catch (error) {
            console.log("remove file error", error);
        }
    };
    static async checkPathExists(path: string): Promise<boolean> {
        const storageRef = ref(storage, path);
        try {
            await getDownloadURL(storageRef);
            return true;
        } catch (error: any) {
            if (error.code === "storage/object-not-found") {
                return false;
            }
            throw error;
        }
    }
}
