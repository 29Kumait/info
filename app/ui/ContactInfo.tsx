import React, { FC } from "react";
import { SocialMediaLinks } from "~/ui/SocialMediaLinks";
import Contact from "~/ui/mdx/groupTow/contact.mdx";

type InfoCardData = {
    slug: string;
    title: string;
};

const infoCards: InfoCardData[] = [
    { slug: "contact", title: "CONTACT INFO" },
    { slug: "media", title: "SOCIAL MEDIA" },

];

const mdxComponents: Record<string, FC> = {
    media: SocialMediaLinks,
    contact: Contact,
};

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
}
const InfoCards: FC<InfoCardProps> = ({ title, children }) => (
    <div className="relative z-10 text-gray-700 rounded-lg shadow-md p-3 m-8 bg-transition-transform transform hover:scale-105 hover:shadow-lg hover:z-10"
        style={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(0, 0, 255, 0.4)" }}
    >
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div>{children}</div>
    </div>
);


const ContactInfo: FC = () => (
    <section className="w-full p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
            {infoCards.map((card) => {
                const Component = mdxComponents[card.slug];
                return (
                    <InfoCards key={card.slug} title={card.title}>
                        <Component />
                    </InfoCards>
                );
            })}
        </div>
    </section>
);

export default ContactInfo;