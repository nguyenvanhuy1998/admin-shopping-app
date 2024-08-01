import { collectionNames } from "@/constants/collectionNames";
import { fs } from "@/firebase/firebaseConfig";
import { Offer } from "@/models/offer";
import { Button } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Offers = () => {
    const router = useRouter();
    const [offers, setOffers] = useState<Offer[]>([]);
    useEffect(() => {
        onSnapshot(collection(fs, collectionNames.offers), (snap) => {
            if (snap.empty) {
                console.log("Data not found");
            } else {
                const items: Offer[] = [];
                snap.forEach((item: any) => {
                    items.push(item.data());
                });
                setOffers(items);
            }
        });
    }, []);
    // const columns: ColumnProps<User>[] = [
    //     {
    //         key: "name",
    //         dataIndex: "displayName",
    //         title: "Username",
    //     },
    //     {
    //         key: "email",
    //         dataIndex: "email",
    //         title: "Email",
    //     },
    //     {
    //         key: "createdAt",
    //         dataIndex: "creationTime",
    //         title: "Sign up",
    //         render: (val: Date) => new Date(val).toLocaleString(),
    //         align: "center",
    //     },
    //     {
    //         key: "btn",
    //         title: "",
    //         dataIndex: "",
    //         render: (item: User) => (
    //             <Space>
    //                 <Button icon={<BiTrash size={20} />} danger type="text" />
    //             </Space>
    //         ),
    //         align: "right",
    //     },
    // ];
    return (
        <div className="text-right">
            <Button
                type="primary"
                onClick={() => router.push("/offers/add-new-offer")}
            >
                Add New
            </Button>
        </div>
    );
};

export default Offers;
