
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ImageKit from "imagekit";

import INFO from "~/ui/ContactInfo";
import { PhotoSection } from "./_layout.main.photos";
import { CardsSection } from "./_layout.main.cards";
import { loader as cardsLoader } from "./_layout.main.cards";
import { action as photoAction } from "./_layout.main.photos";
import { CARDS } from "~/data";
import Ticker from "./_layout.main.ticker";
import { AppsSection } from "./_layout.main.apps";
import { App, Image, Position , Card} from "~/types/type";
import { connectDB } from "~/db/mongoDB.server";
import Tabs from "~/ui/Tabs";
import { loader as eventsLoader } from "./_events";

import ScrollFade from "../ui/ScrollFade";

interface LoaderData {
    images: Image[];
    positions: Record<string, Position>;
    cardsData: { cards: Card[] };
    appsData: { apps: App[] };
    eventsData: any;
    tickerData: { cards: Card[] };
}
export const loader: LoaderFunction = async (args) => {
    const { db } = await connectDB();
    const data = await db.collection("app").findOne<{ apps: App[] }>({});
    invariant(data, "No data found in the database");

    invariant(process.env.IMAGEKIT_PUBLIC_KEY, "IMAGEKIT_PUBLIC_KEY is required");
    invariant(process.env.IMAGEKIT_PRIVATE_KEY, "IMAGEKIT_PRIVATE_KEY is required");
    invariant(process.env.IMAGEKIT_URL_ENDPOINT, "IMAGEKIT_URL_ENDPOINT is required");

    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    const files = await imagekit.listFiles({});
    const imagePositions: Record<string, Position> = {};

    files.forEach((image, index) => {
        if (!imagePositions[image.fileId]) {
            const xPercent = 20 + Math.random() * 20;
            const yPercent = 30 + Math.random() * 20;
            imagePositions[image.fileId] = {
                x: xPercent,
                y: yPercent,
                zIndex: index + 1,
            };
        }
    });

    const [cardsData, eventsData] = await Promise.all([
        cardsLoader(args),
        eventsLoader(args),
    ]);

    return {
        images: files,
        positions: imagePositions,
        cardsData,
        appsData: { apps: data.apps },
        tickerData: { cards: CARDS },
        eventsData,
    };
};

// Reuse the child route's action
export const action: ActionFunction = photoAction;

export default function MainLayout() {
    const {
        images,
        positions,
        cardsData,
        appsData,
        tickerData,
        eventsData,
    } = useLoaderData<LoaderData>();

    return (
        <div className="main-layout">

            <INFO />

            <ScrollFade duration={800} direction="left">
            <PhotoSection images={images} initialPositions={positions} />
            </ScrollFade>
                <ScrollFade duration={700} direction="up">

            <CardsSection cards={cardsData.cards} />
            </ScrollFade>

            <ScrollFade duration={900} direction="right">

            <AppsSection apps={appsData.apps} />
                </ScrollFade>

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