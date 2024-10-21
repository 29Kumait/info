import {useLoaderData} from "@remix-run/react";
import {LoaderFunction , json} from "@remix-run/node";
import React , {FC} from "react";

import Media from "./mdx/group3/media.mdx";
import Contact from "./mdx/group3/contact.mdx";


type CardData = {
    slug: string;
    title: string;
};

const mdxFiles: Record<string , FC> = {
    media: Media ,
    contact: Contact ,
};

const cards: CardData[] = [
    {slug: "contact" , title: "CONTACT INFO"} ,
    {slug: "media" , title: "SOCIAL MEDIA"} ,
];

export const loader: LoaderFunction = async () => {
    return json ({cards});
};

interface CardProps {
    title: string;
    children: React.ReactNode;
}

export function Card({title , children}: CardProps) {
    return (
        <div
            className="relative bg-dark-blue-black-01 dark:bg-dark-blue-black-03 text-gray-200 dark:text-white rounded-lg shadow-glow p-8 transition-transform transform hover:scale-105 hover:-hue-rotate-15 hover:shadow-xl hover:shadow-blue-600/50 resource-card">
            <div
                className="absolute inset-0 z-[-1] transition-opacity duration-500 opacity-0 resource-card::before"></div>
            <h3 className="text-xl font-semibold mb-2">{ title }</h3>
            <div className="text-gray-400 dark:text-gray-300 mb-6">{ children }</div>
        </div>
    );
}

export default function Group3Cards() {
    const {cards} = useLoaderData<{ cards: CardData[] }> ();

    return (
        <div
            className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex flex-col justify-center items-center"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28">
                { cards.map ((card) => {
                    const Component = mdxFiles[card.slug];
                    return (
                        <Card key={ card.slug } title={ card.title }>
                            <Component/>
                        </Card>
                    );
                }) }
            </div>
        </div>
    );
}