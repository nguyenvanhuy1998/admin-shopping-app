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
                setOffers([]);
            } else {
                const tempOffers: Offer[] = [];
                snap.forEach((item: any) => {
                    tempOffers.push({
                        id: item.id,
                        ...item.data(),
                    });
                });
                console.log(tempOffers);
                setOffers(tempOffers);
            }
        });
    }, []);

    const handleDeleteOffer = async (item: Offer) => {
        if (item.files && item.files.length > 0) {
            item.files.forEach(
                async (file: any) =>
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
            key: "START_DATE",
            dataIndex: "startDate",
            title: "Start date",
            render: (time: number) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            key: "END_DATE",
            dataIndex: "endDate",
            title: "End date",
            render: (time: number) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            key: "CODE",
            dataIndex: "code",
            title: "Code",
        },
        {
            key: "IMAGE",
            dataIndex: "files",
            title: "Image",
            render: (ids: string[]) => {
                if (ids.length > 0) {
                    return <AvatarComponent id={ids[0]} />;
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
