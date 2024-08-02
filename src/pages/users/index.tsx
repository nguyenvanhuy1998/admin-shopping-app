import { collectionNames } from "@/constants/collectionNames";
import { fs } from "@/firebase/firebaseConfig";
import { User } from "@/models";
import { Button, Space } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        onSnapshot(collection(fs, collectionNames.users), (snap) => {
            if (snap.empty) {
                console.log("Data not found");
            } else {
                const items: User[] = [];
                snap.forEach((item: any) => {
                    items.push(item.data());
                });
                setUsers(items);
            }
        });
    }, []);
    const columns: ColumnProps<User>[] = [
        {
            key: "name",
            dataIndex: "displayName",
            title: "Username",
        },
        {
            key: "email",
            dataIndex: "email",
            title: "Email",
        },
        {
            key: "createdAt",
            dataIndex: "creationTime",
            title: "Sign up",
            render: (val: Date) => new Date(val).toLocaleString(),
            align: "center",
        },
        {
            key: "btn",
            title: "",
            dataIndex: "",
            render: () => (
                <Space>
                    <Button icon={<BiTrash size={20} />} danger type="text" />
                </Space>
            ),
            align: "right",
        },
    ];
    return <Table dataSource={users} columns={columns} />;
};

export default Users;
