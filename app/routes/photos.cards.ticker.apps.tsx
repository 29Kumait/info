import { json } from "@remix-run/node";
import { connectDB } from "~/db/mongoDB.server";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

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
    invariant(db, "Failed to connect to the database");

    const data = await db.collection("app").findOne<{apps: App[]}>({});
    invariant(data, "No data found in the database");

    return json({ apps: data.apps });
}

export default function AppData() {
    const { apps } = useLoaderData<LoaderData>();

    return (
        <div>
            <h1 className="prose-2xl m-12"> Projects Deployments </h1>
            <div className="max-w-5xl mx-auto p-8 rounded-xl shadow-lg justify-evenly bg-gray-900/60 m-3">
                {apps.length > 0 ? (
                    apps.map((app) => (
                        <div key={ app.id }>
                            <h2 className="prose m-6 text-2xl p-6 transition-transform hover:drop-shadow-blue-glow">
                                <a
                                    className="prose font-bold p-4 border-2 border-[#FF507A] rounded-lg text-[#BEE0DB] hover:bg-[#FF507A] hover:text-white no-underline transition-all"
                                    href={ app.deployment }
                                >
                                    { app.title }
                                </a>
                            </h2>


                            <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg bg-gray-800">
                                <iframe
                                    src={ app.deployment }
                                    title={ app.deployment }
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No projects found</div>
                ) }
            </div>
        </div>
    );
}
