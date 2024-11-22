import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';

import { LinksFunction, LoaderFunction } from '@remix-run/node';
import {Outlet , useLoaderData} from '@remix-run/react';
import Button from '../ui/Button';
import stylesUrl from '../styles/CodeSnippet.css?url';
import { getSession } from '~/sessions.server';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesUrl },
];

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get('Cookie'));
    const codeSnippet = session.get('codeSnippet') || '';
    return { codeSnippet };
};

function CodeSnippet() {
    const codeRef = useRef<HTMLPreElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        function startTyping() {
            if (codeRef.current && !eventSourceRef.current) {
                codeRef.current.textContent = '';
                const eventSource = new EventSource('/code-stream');
                eventSourceRef.current = eventSource;

                eventSource.onmessage = (event) => {
                    if (codeRef.current) {
                        const decodedData = decodeURIComponent(event.data);
                        codeRef.current.textContent += decodedData;
                        Prism.highlightElement(codeRef.current);
                    }
                };

                eventSource.onerror = () => {
                    if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                        eventSourceRef.current = null;

                        // If still in view, restart after a delay
                        setTimeout(() => {
                            if (eventSourceRef.current === null && codeRef.current) {
                                startTyping();
                            }
                        }, 2000);
                    }
                };
            }
        }

        function stopTyping() {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startTyping();
                } else {
                    stopTyping();
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (codeRef.current) {
            observer.observe(codeRef.current);
        }

        return () => {
            observer.disconnect();
            stopTyping();
        };
    }, []);

    return (
        <>
            <div className="card">
                <pre ref={codeRef} className="card-pre language-typescript"></pre>
            </div>
        </>
    );
 }

export default function CodeRoute() {
    const { codeSnippet } = useLoaderData<typeof loader>();

    return (
        <>
            <CodeSnippet />
            <Button code={codeSnippet} buttonText="copy" />
            <Outlet/>
        </>
    )
}

import ErrorBoundary from '~/routes/errorBoundary';
export { ErrorBoundary };




/**
 *
 *
 import {  useLoaderData } from "@remix-run/react";
 import { LoaderFunction } from "@remix-run/node";
 import { FC } from "react";
 import AnimatedCard from "~/ui/AnimatedCard";


 import Education from "~/routes/mdx/groupOne/education.mdx";
 import Code from "~/routes/mdx/groupOne/code.mdx";
 import Skills from "~/routes/mdx/groupOne/soft.mdx";

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
 <div className="p-8 mb-24 mt-32 bg-dark-blue-black-01 bg-cover bg-center bg-opacity-90 relative">
 <div className="absolute inset-0 bg-black opacity-10 rounded-xl"></div>
 <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-screen-2xl mx-auto">
 {cards.map((card, index) => (
 <AnimatedCard
 key={card.slug}
 card={card}
 index={index}
 mdxFiles={mdxFiles}
 />
 ))}
 </div>
 </div>
 );
 }


 */