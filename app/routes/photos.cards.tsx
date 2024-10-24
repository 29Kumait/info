import {Outlet , useLoaderData} from "@remix-run/react";
import {LoaderFunction, json} from "@remix-run/node";
import {FC} from "react";

import Education from "./mdx/group1/education.mdx";
import Experience from "./mdx/group1/experience.mdx";
import FCode from "./mdx/group1/f-code.mdx";

type Card = {
    slug: string;
    title: string;
};

const mdxFiles: Record<string, FC> = {
    education: Education,
    experience: Experience,
    sCode: FCode,
};

const cards: Card[] = [
    {slug: "education", title: "Education"},
    {slug: "experience", title: "Experience"},
    {slug: "sCode", title: "Code Skills"},
];

export const loader: LoaderFunction = async () => {
    return json({cards});
};

export default function PhotosCardsGroup1() {
    const {cards} = useLoaderData<{ cards: Card[] }>();

    return (
        <div className="p-8 mt-36 bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Component = mdxFiles[card.slug];

                    if (!Component) {
                        return (
                            <div key={card.slug} className="p-6 border border-transparent text-gray-900 rounded-lg">
                                <h2 className="text-lg opacity-70 mb-2">{`Component not found for ${card.title}`}</h2>
                            </div>
                        );
                    }

                    return (
                        <div key={card.slug} className="p-6 border border-transparent bg-white rounded-lg transition-all duration-200 ease-out hover:scale-102 hover:border-blue-500 hover:shadow-md">
                            <h2 className="text-lg opacity-70 mb-2">{ card.title }</h2>
                            <Component/>
                        </div>
                    );
                })}
            </div>
            <Outlet/>
        </div>
    );
}
