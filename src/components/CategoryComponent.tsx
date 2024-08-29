import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { Category } from "@/models";
import { collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {
    id?: string;
};

const CategoryComponent = ({ id }: Props) => {
    const [category, setCategory] = useState<Category>();
    useEffect(() => {
        id && getCategoryDetailFromFirestore();
    }, [id]);
    const getCategoryDetailFromFirestore = async () => {
        const api = `categories/${id}`;
        try {
            const snap = await getDoc(doc(fs, api));
            const tempCategory: any = {
                ...snap.data(),
                id: snap.id,
            };
            if (snap.exists()) {
                setCategory(tempCategory);
            } else {
                console.log("Category not found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return category ? category.title : "";
};

export default CategoryComponent;
