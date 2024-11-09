import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { FC } from "react";

import Education from "./mdx/group1/education.mdx";
import Experience from "./mdx/group1/experience.mdx";
import Code from "./mdx/group1/code.mdx";
import Skills from "./mdx/group1/soft.mdx";

type Feature = {
    [key: string]: string;
};

export interface App {
    id: string;
    title: string;
    deployment: string;
    github: string;
    overview: string;
    description: string;
    features?: Feature[];
}

type Card = {
    slug: string;
    title: string;
};

const mdxFiles: Record<string, FC> = {
    education: Education,
    experience: Experience,
    code: Code,
    skills: Skills,
};

const cards: Card[] = [
    { slug: "education", title: "Education" },
    { slug: "code", title: "Code Skills" },
    { slug: "skills", title: "Soft Skills" },
    // {slug: "experience", title: "Experience"},
];

export const loader: LoaderFunction = async () => {
    return json({ cards });
};

export default function PhotosCardsGroup1() {
    const { cards } = useLoaderData<{ cards: Card[] }>();

    return (
        <div
            className="p-8 mt-36 bg-cover bg-center bg-opacity-90 relative"
            style={{ backgroundImage: "url('/board.tiff')" }}
        >
            <div className="absolute inset-0 bg-black opacity-10 rounded-xl"></div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-screen-2xl mx-auto">
                {cards.map((card) => {
                    const Component = mdxFiles[card.slug];
                    return (
                        <div
                            key={card.slug}
                            className="animated-border p-6 max-w-screen-xl w-full border border-gray-200 bg-white rounded-xl shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-opacity-90">
                                {card.title}
                            </h2>
                            <div className="max-h-48 overflow-y-auto hidden-scrollbar">
                                <Component />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="inset-0 bg-black opacity-25 rounded-xl m-28">
                <h1 className="prose-2xl text-5xl md:text-6xl lg:text-9xl text-blue-100 lg:m-12 mt-24 bg-cover bg-no-repeat bg-blend-multiply bg-clip-text">
                    {'<Projects Deployment showcase={App.active} />'}
                </h1>
            </div>
            <Outlet />
        </div>
    );
}