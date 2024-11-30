import {useLoaderData} from "@remix-run/react";
import {LoaderFunction} from "@remix-run/node";
import {FC} from "react";
import {useInView} from "react-intersection-observer";


import Education from "~/routes/mdx/groupOne/education.mdx";
import Code from "~/routes/mdx/groupOne/code.mdx";
import Skills from "~/routes/mdx/groupOne/soft.mdx";

type Card = {
    slug: string;
    title: string;
};

const mdxFiles: Record<string , FC> = {
    education: Education ,
    code: Code ,
    skills: Skills ,

};


const cards: Card[] = [
    {slug: "education" , title: "Education"} ,
    {slug: "code" , title: "Code Skills"} ,
    {slug: "skills" , title: "Soft Skills"} ,
];

export const loader: LoaderFunction = async () => {
    return {cards};
};

export default function CardsRoute() {
    const {cards} = useLoaderData<{ cards: Card[] }> ();
    return <CardsSection cards={ cards }/>;
}

export function CardsSection({cards}: { cards: Card[] }) {
    return (
        <div
            className=" grid sm:grid-cols-1 lg:grid-cols-3  bg-gray-900 text-white scheme-dark overflow-y-scroll min-h-screen  place-items-center"
        >
            { cards.map ((card , index) => (
                <AnimatedCard
                    key={ card.slug }
                    card={ card }
                    index={ index }
                    mdxFiles={ mdxFiles }
                />
            )) }
        </div>
    );
}


interface AnimatedCardProps {
    card: Card;
    index: number;
    mdxFiles: Record<string , FC>;
    className?: string;
}

const AnimatedCard: FC<AnimatedCardProps> = ({card , index , mdxFiles}) => {
    const hydrated = useHydrated ();

    const {ref , inView} = useInView ({
        threshold: 0.2 ,
        triggerOnce: true ,
        skip: !hydrated ,
        initialInView: false ,
    });

    const Component = mdxFiles[card.slug];

    let animationClass = "";
    if (inView) {
        if (index % 3 === 0) {
            animationClass = "animate-slide-in-left";
        } else if (index % 3 === 1) {
            animationClass = "animate-slide-in-bottom";
        } else {
            animationClass = "animate-slide-in-right";
        }
    }

    return (
        <div className="group p-4">

            <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <div
                    ref={ ref }
                    className={ `animated-border p-6 max-w-screen-xl w-full border border-gray-200 bg-white rounded-xl shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg ${ animationClass }` }
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text/90">
                        { card.title }
                    </h2>
                    <div className="max-h-96 overflow-auto  hidden-scrollbar">
                        <MDXWrapper Component={ Component }/>
                    </div>
                </div>
            </div>
        </div>
    );
};



interface MDXWrapperProps {
    Component: FC;
    className?: string;
}

const MDXWrapper: FC<MDXWrapperProps> = ({ Component, className }) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <div
            ref={ref}
            className={`${className || ""} ${inView ? "fade-in scroll-hint" : ""}`}
        >
            <Component />
        </div>
    );
};

// useHydrated.ts
import {useState , useEffect} from "react";

function useHydrated() {
    const [hydrated , setHydrated] = useState (false);
    useEffect (() => {
        setHydrated (true);
    } , []);
    return hydrated;
}

//
// import { Outlet, useLoaderData } from "@remix-run/react";
// import { LoaderFunction } from "@remix-run/node";
// import { FC, lazy, Suspense } from "react";
// import MDXWrapper from "~/ui/MDXWrapper";
//
// const Education = lazy(() => import("~/routes/mdx/groupOne/education.mdx"));
// const Code = lazy(() => import("~/routes/mdx/groupOne/code.mdx"));
// const Skills = lazy(() => import("~/routes/mdx/groupOne/soft.mdx"));
//
// type Card = {
//     slug: string;
//     title: string;
// };
//
// const mdxFiles: Record<string, FC> = {
//     education: Education,
//     code: Code,
//     skills: Skills,
// };
//
// const cards: Card[] = [
//     { slug: "education", title: "Education" },
//     { slug: "code", title: "Code Skills" },
//     { slug: "skills", title: "Soft Skills" },
// ];
//
// export const loader: LoaderFunction = async () => {
//     return { cards };
// };
//
// export default function CardsRoute() {
//     const { cards } = useLoaderData<{ cards: Card[] }>();
//     return <CardsSection cards={cards} />;
// }
//
// export function CardsSection({ cards }: { cards: Card[] }) {
//
//     return (
//         <div
//             className="p-8 mb-24 mt-32 bg-dark-blue-black-01 bg-cover bg-center bg-opacity-90 relative"
//         >
//             <div className="absolute inset-0 bg-black opacity-10 rounded-xl"></div>
//             <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-(--breakpoint-2xl) mx-auto">
//                 {cards.map((card) => {
//                     const Component = mdxFiles[card.slug];
//                     return (
//                         <div
//                             key={card.slug}
//                             className="animated-border p-6 max-w-(--breakpoint-xl) w-full border border-gray-200 bg-white rounded-xl shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg"
//                         >
//                             <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-opacity-90">
//                                 {card.title}
//                             </h2>
//                             <div className="max-h-48 overflow-y-auto hidden-scrollbar">
//                                 <Suspense fallback={<div>Loading...</div>}>
//                                     <MDXWrapper Component={Component} />
//                                 </Suspense>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//
//             <Outlet />
//         </div>
//     );
// }
