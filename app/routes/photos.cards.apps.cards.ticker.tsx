import { json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { CARDS } from "~/data";
import type { Card } from "~/types/type";
import invariant from "tiny-invariant";

export const loader = async () => {
    invariant(CARDS.length > 0, "CARDS data must not be empty");
    return json({ cards: CARDS });
};

export default function Ticker() {
    const { cards } = useLoaderData<{ cards: Card[] }>();
    invariant(cards.length > 0, "No cards loaded");

    const duplicatedCards = [...cards, ...cards];

    return (
        <div className="bg-transparent w-full text-gray-800 rounded-lg overflow-hidden mt-12 z-10 relative"
                 >
            <div className="relative overflow-hidden px-6 mb-12">
                <div className="animate-marquee flex space-x-28 hover:animation-pause">
                    {duplicatedCards.map((card, index) => (
                        <div key={index} className="p-4 flex-shrink-0 w-[250px]">
                            <div>
                                {card.icon && (
                                    <img
                                        src={card.icon}
                                        alt={`Icon for card ${card.id}`}
                                        className="w-16 h-16 mb-6 mx-auto icon-float"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Outlet />
        </div>
    );
}
