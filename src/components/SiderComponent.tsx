import { collectionNames } from "@/constants";
import { ProductFilled } from "@ant-design/icons";
import { Layout, MenuProps, Menu } from "antd";
import Link from "next/link";
import React from "react";
import { BiCategory, BiHome, BiSolidOffer, BiUser } from "react-icons/bi";
const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
    {
        key: collectionNames.home,
        label: <Link href={"/"}>Home</Link>,
        icon: <BiHome />,
    },
    {
        key: collectionNames.users,
        label: <Link href={`/${collectionNames.users}`}>Users</Link>,
        icon: <BiUser />,
    },
    {
        key: collectionNames.offers,
        label: <Link href={`/${collectionNames.offers}`}>Offers</Link>,
        icon: <BiSolidOffer />,
    },
    {
        key: collectionNames.categories,
        label: <Link href={`/${collectionNames.categories}`}>Categories</Link>,
        icon: <BiCategory />,
    },
    {
        key: collectionNames.products,
        label: <Link href={`/${collectionNames.products}`}>Products</Link>,
        icon: <ProductFilled />,
    },
];
const SiderComponent = () => {
    return (
        <Sider
            style={{
                height: "100vh",
            }}
        >
            <Menu items={items} theme="dark" />
        </Sider>
    );
};

export default SiderComponent;
