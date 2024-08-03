import { AvatarComponent, HeadComponent } from "@/components";
import { collectionNames } from "@/constants/collectionNames";
import { fs } from "@/firebase/firebaseConfig";
import { Offer } from "@/models";
import { HandleFile } from "@/utils/handleFile";
import { Button, Modal, Space, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
const { confirm } = Modal;

const Offers = () => {
    const router = useRouter();
    const [offers, setOffers] = useState<Offer[]>([]);
    useEffect(() => {
        onSnapshot(collection(fs, collectionNames.offers), (snap) => {
            if (snap.empty) {
                console.log("Data not found");
                setOffers([]);
            } else {
                const items: Offer[] = [];
                snap.forEach((item: any) => {
                    items.push({
                        id: item.id,
                        ...item.data(),
                    });
                });

                setOffers(items);
            }
        });
    }, []);
    const columns: ColumnProps<Offer>[] = [
        {
            key: "TITLE",
            dataIndex: "title",
            title: "Title",
        },
        {
            key: "DESC",
            dataIndex: "description",
            title: "Description",
        },
        {
            key: "PERCENT",
            dataIndex: "percent",
            title: "Percent (%)",
        },
        {
            key: "START_AT",
            dataIndex: "startAt",
            title: "Start at",
            render: (time: string) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            key: "END_AT",
            dataIndex: "endAt",
            title: "End at",
            render: (time: string) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            key: "CODE",
            dataIndex: "code",
            title: "Code",
        },
        {
            key: "IMAGE_URL",
            dataIndex: "",
            title: "Avatar",
            render: (item: Offer) => {
                if (item.files) {
                    return <AvatarComponent imageUrl={item.files[0].url} />;
                }
                return null;
            },
        },
        {
            key: "DELETE",
            dataIndex: "",
            title: "Action",
            render: (item: Offer) => {
                return (
                    <Space>
                        <Button
                            type="text"
                            danger
                            icon={<BiTrash size={20} />}
                            onClick={() =>
                                confirm({
                                    title: "Confirm",
                                    content: "Delete offer?",
                                    onOk: () => handleDeleteOffer(item),
                                })
                            }
                        />
                    </Space>
                );
            },
        },
    ];
    const handleDeleteOffer = async (item: Offer) => {
        if (item.files && item.files.length > 0) {
            item.files.forEach(
                async (file) =>
                    await HandleFile.removeFile(
                        collectionNames.offers,
                        item.id,
                        file
                    )
            );
        } else {
            await deleteDoc(doc(fs, `${collectionNames.offers}/${item.id}`));
        }
    };
    return (
        <>
            <HeadComponent
                title="Offers"
                pageTitle="Offers"
                extra={
                    <Button
                        type="primary"
                        onClick={() => router.push("/offers/add-new-offer")}
                    >
                        Add new
                    </Button>
                }
            />
            <Table dataSource={offers} columns={columns} />
        </>
    );
};

export default Offers;
