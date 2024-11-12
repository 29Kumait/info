import React, { FC } from "react";
import { SocialMediaLinks } from "~/ui/SocialMediaLinks";
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
    media: SocialMediaLinks,
    contact: Contact,
};

interface FooterCardProps {
    title: string;
    children: React.ReactNode;
}

const FooterCard: FC<FooterCardProps> = ({ title, children }) => (
    <div className="relative bg-gray-800 dark:bg-gray-700 text-gray-200 dark:text-gray-100 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div >{children}</div>
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