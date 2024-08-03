import { Avatar } from "antd";
import React from "react";

type Props = {
    imageUrl: string;
};

const AvatarComponent = ({ imageUrl }: Props) => {
    return <Avatar src={imageUrl} />;
};
export default AvatarComponent;
