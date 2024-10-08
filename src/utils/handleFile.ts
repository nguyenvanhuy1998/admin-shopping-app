import { collectionNames } from "@/constants";
import { fs, storage } from "@/firebase/firebaseConfig";
import {
    addDoc,
    arrayUnion,
    collection,
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
            const snap = await addDoc(collection(fs, collectionNames.files), {
                path,
                url,
                createdAt: Date.now(),
                updateAt: Date.now(),
            });
            const fileId = snap.id;
            if (fileId) {
                await updateDoc(doc(fs, `${collectionName}/${id}`), {
                    files: arrayUnion(fileId),
                });
            }
        } catch (error) {
            console.log("Save URL to firestore database error", error);
        }
    };
    static removeFile = async (id: string) => {
        try {
            const snap = await getDoc(
                doc(fs, `${collectionNames.files}/${id}`)
            );
            if (snap.exists()) {
                const { path } = snap.data();
                if (path) {
                    await deleteObject(ref(storage, `${path}`));
                }
                await deleteDoc(doc(fs, `${collectionNames.files}/${id}`));
            } else {
                console.log("file does not exist");
            }
        } catch (error) {
            console.log("remove file error", error);
        }
    };
}
