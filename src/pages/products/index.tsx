import { HeadComponent } from "@/components";
import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";

const Products = () => {
    const router = useRouter();
    return (
        <div>
            <HeadComponent
                title="Products"
                pageTitle="Products"
                extra={
                    <Button
                        type="primary"
                        onClick={() => router.push("/products/add-new-product")}
                    >
                        Add new
                    </Button>
                }
            />
        </div>
    );
};

export default Products;
