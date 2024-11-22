import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import INFO from "~/ui/ContactInfo";
import { PhotoSection } from "./_layout.main.photos";
import { loader as photosLoader, action as photoAction,  } from "./_layout.main.photos";

import { CardsSection } from "./_layout.main.cards";
import { loader as cardsLoader } from "./_layout.main.cards";

import Ticker from "./_layout.main.ticker";
import { CARDS } from "~/data";

import { AppsSection } from "./_layout.main.apps";
import { App } from "~/types/type";
import { connectDB } from "~/db/mongoDB.server";
import invariant from "tiny-invariant";

import Tabs from "~/ui/Tabs";
import { loader as eventsLoader } from "./_events";

export const loader: LoaderFunction = async (args) => {
    const { db } = await connectDB();
    const data = await db.collection("app").findOne<{ apps: App[] }>({});
    invariant(data, "No data found in the database");

    const [cardsData, eventsData, photosData] = await Promise.all([
        cardsLoader(args),
        eventsLoader(args),
        photosLoader(args),
    ]);

    return {
        cardsData,
        appsData: { apps: data.apps },
        tickerData: { cards: CARDS },
        eventsData,
        photosData,
    };
};

export const action: ActionFunction = photoAction;

export default function MainLayout() {
    const { cardsData, appsData, tickerData, eventsData, photosData } = useLoaderData<typeof loader>();

    return (
        <div className="main-layout">
            <INFO />

            <PhotoSection images={photosData.images} initialPositions={photosData.positions} />

            <CardsSection cards={cardsData.cards} />

            <AppsSection apps={appsData.apps} />

            <nav
                className="container mx-auto p-8 flex justify-center bg-transparent rounded-lg overflow-hidden mt-12 z-10 relative"
                style={{
                    boxShadow: "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)",
                }}
            >
                <Tabs eventTypes={eventsData.eventTypes} />
            </nav>

            <Ticker cards={tickerData.cards} />

            <Outlet />
        </div>
    );
}
