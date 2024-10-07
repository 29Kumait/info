import { json } from "@remix-run/node";
import { connectDB } from "~/db/mongoDB.server";
import { useLoaderData } from "@remix-run/react";

interface App {
    id: string;
    title: string;
    deployment: string;
}

interface LoaderData {
    apps: App[];
}

export async function loader() {
    const { db } = await connectDB();

    const data = await db.collection("app").findOne({});

    if (!data) {
        return new Response("No data found", { status: 404 });
    }

    return json({ apps: data.apps });
}

export default function AppData() {
    const { apps } = useLoaderData<LoaderData>();

    return (
        <div>
            <h1 className="prose-2xl m-12"> Projects Deployment </h1>
            <div className="max-w-5xl mx-auto p-8 rounded-xl shadow-lg justify-evenly bg-gray-900/60 m-3">
                {apps.map((app) => (
                    <div key={app.id}>
                        <p>
                            <a href={app.deployment}>{app.title}</a>
                        </p>
                        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg bg-gray-800">
                            <iframe
                                src={app.deployment}
                                title={app.deployment}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}