// Footer.tsx
import React, { FC, Suspense, lazy } from 'react';

type FooterCardData = {
    slug: keyof typeof mdxComponents;
    title: string;
};

const footerCards: FooterCardData[] = [
    { slug: 'media', title: 'SOCIAL MEDIA' },
    { slug: 'contact', title: 'CONTACT INFO' },
];

const mdxComponents = {
    media: lazy(() => import('~/ui/mdx/groupTow/media.mdx')),
    contact: lazy(() => import('~/ui/mdx/groupTow/contact.mdx')),
};

interface FooterCardProps {
    title: string;
    children: React.ReactNode;
}

const FooterCard: FC<FooterCardProps> = ({ title, children }) => (
    <div className="relative bg-gray-800 text-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Footer: FC = () => (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {footerCards.map((card) => {
                const Component = mdxComponents[card.slug];
                return (
                    <FooterCard key={card.slug} title={card.title}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Component />
                        </Suspense>
                    </FooterCard>
                );
            })}
        </div>
    </footer>
);

export default Footer;
