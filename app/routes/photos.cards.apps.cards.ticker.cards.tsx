// // PHOTOS.CARDS.APPS.CARDS.TICKER.MUSIC.CARDS.tsx
// import React, { FC } from "react";
// import Media from "~/ui/mdx/groupTow//media.mdx";
// import Contact from "~/ui/mdx/groupTow/contact.mdx";
//
// type CardData = {
//     slug: string;
//     title: string;
// };
//
// const mdxFiles: Record<string, FC> = {
//     media: Media,
//     contact: Contact,
// };
//
// const cards: CardData[] = [
//     { slug: "media", title: "SOCIAL MEDIA" },
//     { slug: "contact", title: "CONTACT INFO" },
// ];
//
// interface CardProps {
//     title: string;
//     children: React.ReactNode;
// }
//
// export function Card({ title, children }: CardProps) {
//     return (
//         <div className="relative bg-dark-blue-black-01 dark:bg-dark-blue-black-03 text-gray-200 dark:text-white rounded-lg shadow-glow p-6 transition-transform transform hover:scale-105 hover:-hue-rotate-15 hover:shadow-xl hover:shadow-blue-600/50 resource-card">
//             <h3 className="text-xl font-semibold mb-2">{title}</h3>
//             <div className="text-gray-400 dark:text-gray-300">{children}</div>
//         </div>
//     );
// }
//
// const Group3Cards: FC = () => (
//     <div className="hidden" /> // Removed loader logic for reusability
// );
//
// export default Group3Cards;