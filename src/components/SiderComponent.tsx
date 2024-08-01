import { Layout, MenuProps, Menu } from "antd";
import Link from "next/link";
import React from "react";
import { BiHome, BiSolidOffer, BiUser } from "react-icons/bi";
const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
    {
        key: "home",
        label: <Link href={"/"}>Home</Link>,
        icon: <BiHome />,
    },
    {
        key: "users",
        label: <Link href={"/users"}>Users</Link>,
        icon: <BiUser />,
    },
    {
        key: "offers",
        label: <Link href={"/offers"}>Offers</Link>,
        icon: <BiSolidOffer />,
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
