import {Outlet , useLoaderData} from "@remix-run/react";
import {LoaderFunction, json} from "@remix-run/node";
import {FC} from "react";

import SSkills from "./mdx/group2/soft-skills.mdx";
import Skills from "./mdx/group2/technical-skills.mdx";
import Summary from "./mdx/group2/summary.mdx";

type Card = {
    slug: string;
    title: string;
};

const mdxFiles: Record<string, FC> = {
    sSkills: SSkills,
    skills: Skills,
    summary: Summary,
};

const cards: Card[] = [
    {slug: "sSkills", title: "Soft Skills"},
    {slug: "skills", title: "Technical Skills"},
    {slug: "summary", title: "Summary"},
];

export const loader: LoaderFunction = async () => {
    return json({cards});
};

export default function PhotosCardsGroup2() {
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
                        <div key={card.slug} className="p-6 border border-transparent bg-white rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:border-blue-500 shadow-lg">
                            <h2 className="text-lg opacity-70 mb-2">{card.title}</h2>
                            <Component />
                        </div>
                    );
                })}
            </div>
            <Outlet/>
        </div>
    );
}
