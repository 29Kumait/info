import React, { FC } from "react";
import Media from "~/ui/mdx/groupTow/media.mdx";
import Contact from "~/ui/mdx/groupTow/contact.mdx";

type FooterCardData = {
    slug: string;
    title: string;
};

const footerCards: FooterCardData[] = [
    { slug: "media", title: "SOCIAL MEDIA" },
    { slug: "contact", title: "CONTACT INFO" },
];

const mdxComponents: Record<string, FC> = {
    media: Media,
    contact: Contact,
};

interface FooterCardProps {
    title: string;
    children: React.ReactNode;
}

const FooterCard: FC<FooterCardProps> = ({ title, children }) => (
    <div className="relative bg-dark-blue-black-01 dark:bg-dark-blue-black-03 text-gray-200 dark:text-white rounded-lg shadow-glow p-6 transition-transform transform hover:scale-105 hover:-hue-rotate-15 hover:shadow-xl hover:shadow-blue-600/50 resource-card">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="text-gray-400 dark:text-gray-300 space-y-4">{children}</div>
    </div>
);

const Footer: FC = () => (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {footerCards.map((card) => {
                const Component = mdxComponents[card.slug];
                return (
                    <FooterCard key={card.slug} title={card.title}>
                        <Component />
                    </FooterCard>
                );
            })}
        </div>
    </footer>
);

export default Footer;