

import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import INFO from "~/ui/ContactInfo";
import { PhotoSection } from "./_layout.main.photos";
import { loader as photosLoader } from "./_layout.main.photos";
import { action as photoAction } from "./_layout.main.photos";

import { CardsSection } from "./_layout.main.cards";
import { loader as cardsLoader } from "./_layout.main.cards";

import { TickerSection } from "./_layout.main.ticker";
import { loader as tickerLoader } from "./_layout.main.ticker";

import { AppsSection } from "./_layout.main.apps";
import { loader as appsLoader } from "./_layout.main.apps";

import Tabs from "~/ui/Tabs";
import { loader as eventsLoader } from "./_events";



export const loader: LoaderFunction = async (args) => {
    const photoData = await photosLoader(args);
    const cardsData = await cardsLoader(args);
    const appsData = await appsLoader(args);
    const tickerData = await tickerLoader(args);
    const eventsData = await eventsLoader(args);


    return { photoData, cardsData, appsData, tickerData, eventsData };
};

export const action: ActionFunction = photoAction;

export default function MainLayout() {
    const { photoData, cardsData, appsData, tickerData, eventsData } = useLoaderData<typeof loader>();
    const { images, positions } = photoData;
    const { eventTypes } = eventsData;



    return (
        <div className="main-layout">
            <INFO />
            <PhotoSection images={images} initialPositions={positions} />
            <CardsSection cards={cardsData.cards} />
            <AppsSection apps={appsData.apps} />
            <nav className="container mx-auto p-8 flex justify-center bg-transparent rounded-lg overflow-hidden mt-12 z-10 relative"
                style={{
                    boxShadow: "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)",
                }}
            >
                <Tabs eventTypes={eventTypes} />
            </nav>
            <TickerSection cards={tickerData.cards} />
        </div>)
}
