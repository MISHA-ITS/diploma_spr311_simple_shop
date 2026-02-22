import React from "react";
import { ICategory } from "../../types/Category/types.ts";
import CardSection from "./CardSection.tsx";

type CategoriesBlockProps = {
    categories: ICategory[];
};

const CategoriesBlock: React.FC<CategoriesBlockProps> = ({ categories }) => {
    return (
        <section className="mt-[75px] w-full max-w-[1920px] flex flex-col items-center gap-[40px]">
            <div className="w-full min-w-[1364px] max-w-[1920px] mx-auto">
                <h2 className="text-[32px] mb-10 font-inter font-bold text-center text-black">
                    Розділи у Sellix
                </h2>

                <CardSection categories={categories} />
            </div>
        </section>
    );
};

export default CategoriesBlock;