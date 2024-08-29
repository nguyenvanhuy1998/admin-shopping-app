import { collectionNames } from "@/constants";
import { fs } from "@/firebase";
import { File } from "@/models";
import { Avatar } from "antd";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {
    url: string;
};

const AvatarComponent = ({ url }: Props) => {
    return <Avatar src={url} />;
};
export default AvatarComponent;
