import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { FC, lazy, Suspense } from "react";
import MDXWrapper from "~/ui/MDXWrapper";

const Education = lazy(() => import("~/routes/mdx/groupOne/education.mdx"));
const Code = lazy(() => import("~/routes/mdx/groupOne/code.mdx"));
const Skills = lazy(() => import("~/routes/mdx/groupOne/soft.mdx"));

type Card = {
    slug: string;
    title: string;
};

const mdxFiles: Record<string, FC> = {
    education: Education,
    code: Code,
    skills: Skills,
};

const cards: Card[] = [
    { slug: "education", title: "Education" },
    { slug: "code", title: "Code Skills" },
    { slug: "skills", title: "Soft Skills" },
];

export const loader: LoaderFunction = async () => {
    return { cards };
};

export default function CardsRoute() {
    const { cards } = useLoaderData<{ cards: Card[] }>();
    return <CardsSection cards={cards} />;
}

export function CardsSection({ cards }: { cards: Card[] }) {

    return (
        <div
            className="p-8 mb-24 mt-32 bg-dark-blue-black-01 bg-cover bg-center bg-opacity-90 relative"
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
                                <Suspense fallback={<div>Loading...</div>}>
                                    <MDXWrapper Component={Component} />
                                </Suspense>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Outlet />
        </div>
    );
}
