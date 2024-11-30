// import { useLoaderData } from "@remix-run/react";
// import { LoaderFunction } from "@remix-run/node";
// import { CARDS } from "~/data";
import type { Card } from "~/types/type";
// import invariant from "tiny-invariant";

// export const loader: LoaderFunction = async () => {
//     invariant(CARDS.length > 0, "CARDS data must not be empty");
//     return { cards: CARDS };
// };

// export default function TickerRoute() {
//     const { cards } = useLoaderData<{ cards: Card[] }>();
//     invariant(cards.length > 0, "No cards loaded");
//
//     return <Ticker cards={cards} />;
// }

export default function Ticker({ cards }: { cards: Card[] }) {

    const duplicatedCards = [...cards, ...cards];

    return (
        <div className="bg-slate-950 w-full rounded-lg overflow-hidden mt-12 z-10 relative justify-center">
            <div className="relative overflow-hidden px-6 m-12">
                <div className="animate-marquee flex space-x-28 hover:animation-pause">
                    {duplicatedCards.map((card, index) => (
                        <div key={index} className="p-4 shrink-0 w-[250px]">
                            <div>
                                {card.icon && (
                                    <img
                                        src={card.icon}
                                        alt={`Icon for card ${card.id}`}
                                        className="w-16 h-16 mb-6 mx-auto icon-float"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
